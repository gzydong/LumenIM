import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'

// 在 ES 模块中模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadOpenApiDoc(filename) {
  try {
    const filePath = path.resolve(__dirname, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')

    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      return yaml.parse(fileContent)
    }

    return JSON.parse(fileContent)
  } catch (error) {
    console.error('读取 OpenAPI 文档失败:', error)
    return null
  }
}

function convertSchemaToType(schema) {
  if (schema.$ref) {
    return schema.$ref.split('/').pop()
  }

  switch (schema.type) {
    case 'string':
      return 'string'
    case 'integer':
      return 'number'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return `${convertSchemaToType(schema.items)}[]`
    case 'object':
      if (schema.properties) {
        return 'object'
      }
      return 'Record<string, any>'
    default:
      return 'any'
  }
}

function camelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toLowerCase())
}

// 添加一个新的函数用于驼峰转下划线
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function generateTypeDefinitions(doc) {
  let typeCode = `// 自动生成的类型定义\n// 注：***请勿手动修改此文件***  \n\n`

  for (const [schemaName, schema] of Object.entries(doc.components.schemas)) {
    typeCode += `export interface ${schemaName} {\n`

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const required = schema.required?.includes(propName) ? '' : '?'
        const tsType = convertSchemaToType(propSchema)

        let name = propName
        if (propName.includes('@')) {
          name = `'${propName}'`
        } else {
          // 将驼峰命名转换为下划线命名
          name = camelToSnake(propName)
        }

        if (propSchema?.description) {
          typeCode += `  /** ${propSchema.description} */\n`
        }

        typeCode += `  ${name}${required}: ${tsType}\n`
      }
    }

    typeCode += `}\n\n`
  }

  return typeCode
}

function generateApiMethodDescription(operation) {
  if (!operation.description) return ''

  return `/**\n${operation.description
    .split('\n')
    .map((v) => ` * ${v.trim()}`)
    .join('\n')}\n */`
}

function generateApiMethods(doc) {
  let apiCode = ''
  let typeItems = []

  for (const [path, methods] of Object.entries(doc.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const operationId = operation.operationId

      // 生成请求和响应类型
      let requestType = 'any'
      let responseType = 'any'

      // 处理响应类型
      if (operation.responses?.['200']?.content?.['application/json']?.schema?.$ref) {
        responseType = operation.responses['200'].content['application/json'].schema.$ref
          .split('/')
          .pop()
      }

      // 处理请求类型
      if (method === 'post' || method === 'put') {
        if (operation.requestBody?.content?.['application/json']?.schema?.$ref) {
          requestType = operation.requestBody.content['application/json'].schema.$ref
            .split('/')
            .pop()
        }
      } else if (operation.parameters) {
        // GET/DELETE 等方法的查询参数
        const queryParams = operation.parameters.filter((p) => p.in === 'query')
        if (queryParams.length > 0) {
          requestType =
            '{ ' +
            queryParams
              .map((p) => `${p.name}${p.required ? '' : '?'}: ${convertSchemaToType(p.schema)}`)
              .join('; ') +
            ' }'
        } else {
          requestType = 'void'
        }
      }

      // 处理路径参数
      let finalPath = path
      if (operation.parameters) {
        const pathParams = operation.parameters.filter((p) => p.in === 'path')
        if (pathParams.length > 0) {
          // 对于有路径参数的，需要特殊处理
          if (method === 'get' || method === 'put' || method === 'delete') {
            requestType =
              '{ ' +
              pathParams.map((p) => `${p.name}: ${convertSchemaToType(p.schema)}`).join('; ') +
              (operation.parameters.filter((p) => p.in === 'query').length > 0
                ? '; ' +
                  operation.parameters
                    .filter((p) => p.in === 'query')
                    .map(
                      (p) => `${p.name}${p.required ? '' : '?'}: ${convertSchemaToType(p.schema)}`
                    )
                    .join('; ')
                : '') +
              ' }'
          }
        }
      }

      typeItems = [...typeItems, requestType, responseType]

      const description = generateApiMethodDescription(operation)
      apiCode += `${description}\n`
      apiCode += `export const fetch${camelCase(operationId).replaceAll('_', '')} = createApi<${requestType}, ${responseType}>(\n`
      apiCode += `  '${finalPath}',\n`
      apiCode += `  { method: '${method.toUpperCase()}' }\n`
      apiCode += `)\n\n`
    }
  }

  typeItems = [...new Set(typeItems)].filter((item) => item !== 'any')

  return `// 自动生成的 API 方法
// 注：***请勿手动修改此文件***
import { createApi } from './request'
import type {\n${typeItems.map((item) => `  ${item}`).join(',\n')}\n} from './types.d.ts'\n
${apiCode}`
}

// 使用异步函数包装主逻辑
async function main() {
  // 从命令行参数获取文件路径和输出目录
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log('用法: node gen_api_doc.js <openapi文件路径> [输出目录]')
    console.log('示例: node gen_api_doc.js ./openapi.json ./src/api')
    process.exit(1)
  }

  const filePath = args[0]
  const outputDir = args[1] || './src/api' // 默认输出目录

  console.log(`正在读取 OpenAPI 文档: ${filePath}`)
  const doc = await loadOpenApiDoc(filePath)

  if (!doc) {
    console.error('无法加载或解析 OpenAPI 文档')
    process.exit(1)
  }

  console.log(`文档加载成功，准备生成代码到目录: ${outputDir}`)

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 生成类型定义文件
  const typeCode = generateTypeDefinitions(doc)
  const typeFilePath = path.join(outputDir, 'types.d.ts')
  fs.writeFileSync(typeFilePath, typeCode)
  console.log(`类型定义已生成: ${typeFilePath}`)

  // 生成 API 方法文件
  const apiCode = generateApiMethods(doc)
  const apiFilePath = path.join(outputDir, 'api.ts')
  fs.writeFileSync(apiFilePath, apiCode)
  console.log(`API 方法已生成: ${apiFilePath}`)

  console.log('API 文档生成完成')
}

main().catch(console.error)

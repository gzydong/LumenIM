import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'

// 在 ES 模块中模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class ApiGenerator {
  prefix // 方法名前缀

  constructor(prefix = 'fetch') {
    this.prefix = prefix
  }

  loadOpenApiDoc(filename) {
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

  convSchemaToType(schema) {
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
        return `${this.convSchemaToType(schema.items)}[]`
      case 'object':
        if (schema.properties) {
          return 'object'
        }
        return 'Record<string, any>'
      default:
        return 'any'
    }
  }

  camelCase(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toLowerCase())
  }

  // 将驼峰命名转换为下划线命名
  camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  genSchemaType(schemaName, schema) {
    let typeCode = `export interface ${schemaName} {\n`

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const required = schema.required?.includes(propName) ? '' : '?'
        const tsType = this.convSchemaToType(propSchema)

        let name = propName
        if (propName.includes('@')) {
          name = `'${propName}'`
        } else {
          // 将驼峰命名转换为下划线命名
          name = this.camelToSnake(propName)
        }

        if (propSchema?.description) {
          typeCode += `  /** ${propSchema.description} */\n`
        }

        typeCode += `  ${name}${required}: ${tsType}\n`
      }
    }

    typeCode += `}\n\n`

    return typeCode
  }

  genApiMethodDescription(description) {
    if (!description) return ''

    return `/**\n${description
      .split('\n')
      .map((v) => ` * ${v.trim()}`)
      .join('\n')}\n*/`
  }

  getApiMethodRequest(method, operation) {
    // 生成请求和响应类型
    let requestType = 'any'

    // 处理请求类型
    if (method === 'post' || method === 'put') {
      if (operation.requestBody?.content?.['application/json']?.schema?.$ref) {
        requestType = operation.requestBody.content['application/json'].schema.$ref.split('/').pop()
      }
    } else if (operation.parameters) {
      // GET/DELETE 等方法的查询参数
      const queryParams = operation.parameters.filter((p) => p.in === 'query')
      if (queryParams.length > 0) {
        requestType =
          '{\n' +
          queryParams
            .map((p) => `    ${p.name}${p.required ? '' : '?'}: ${this.convSchemaToType(p.schema)}`)
            .join('; \n') +
          ' \n}'
      } else {
        requestType = 'void'
      }
    }

    if (operation.parameters) {
      const pathParams = operation.parameters.filter((p) => p.in === 'path')
      if (pathParams.length > 0) {
        // 对于有路径参数的，需要特殊处理
        if (method === 'get' || method === 'put' || method === 'delete') {
          requestType =
            '{\n' +
            pathParams.map((p) => `    ${p.name}: ${this.convSchemaToType(p.schema)}`).join('; ') +
            (operation.parameters.filter((p) => p.in === 'query').length > 0
              ? '; ' +
                operation.parameters
                  .filter((p) => p.in === 'query')
                  .map(
                    (p) =>
                      `    ${p.name}${p.required ? '' : '?'}: ${this.convSchemaToType(p.schema)}`
                  )
                  .join('; \n')
              : '') +
            ' \n}'
        }
      }
    }

    return requestType
  }

  genApiMethodResponse(operation) {
    // 处理响应类型
    if (operation.responses?.['200']?.content?.['application/json']?.schema?.$ref) {
      return operation.responses['200'].content['application/json'].schema.$ref.split('/').pop()
    }

    return 'any'
  }

  genApiMethod(funName, description, method, path, requestType, responseType) {
    return `
${description}
export const ${this.prefix}${funName} = createApi<${requestType}, ${responseType}>('${path}', '${method.toUpperCase()}')
`
  }

  generateTypeFile(doc) {
    let typeCode = `// 自动生成的类型定义(注：请勿手动修改此文件)\n\n`

    for (const [schemaName, schema] of Object.entries(doc.components.schemas)) {
      typeCode += this.genSchemaType(schemaName, schema)
    }

    return typeCode
  }

  generateApiFile(doc) {
    let apiCode = ''
    let importTypes = []

    for (const [path, methods] of Object.entries(doc.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        const { operationId } = operation
        const requestType = this.getApiMethodRequest(method, operation)
        const responseType = this.genApiMethodResponse(operation)
        const description = this.genApiMethodDescription(operation?.description || '')
        const methodName = this.camelCase(operationId).replaceAll('_', '')

        // 非内联类型，需要导入
        if (!requestType.includes(':')) {
          importTypes.push(requestType)
        }

        importTypes.push(responseType)
        apiCode += this.genApiMethod(
          methodName,
          description,
          method,
          path,
          requestType,
          responseType
        )
      }
    }

    importTypes = [...new Set(importTypes)].filter((item) => item !== 'any')

    return `
// 自动生成的 API 方法(注：请勿手动修改此文件)
// @ts-ignore
import { createApi } from './request.ts'
import type {\n${importTypes.map((item) => `  ${item}`).join(',\n')}\n} from './types.d.ts'

${apiCode}`
  }

  async generate(filePath, outputDir) {
    console.log(`正在读取 OpenAPI 文档: ${filePath}`)
    const doc = this.loadOpenApiDoc(filePath)

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
    const typeFilePath = path.join(outputDir, 'types.d.ts')
    fs.writeFileSync(typeFilePath, this.generateTypeFile(doc))
    console.log(`API 类型定义已生成: ${typeFilePath}`)

    // 生成 API 方法文件
    const apiFilePath = path.join(outputDir, 'api.ts')
    fs.writeFileSync(apiFilePath, this.generateApiFile(doc))
    console.log(`API 方法已生成: ${apiFilePath}`)
    console.log('API 文档生成完成')
  }
}

// 使用异步函数包装主逻辑
async function main() {
  // 从命令行参数获取文件路径和输出目录
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('用法: node gen_api_doc.js <openapi文件路径> [输出目录]')
    console.log('示例: node gen_api_doc.js ./openapi.json ./src/api')
    process.exit(1)
  }

  const filePath = args[0] // OpenAPI 文件路径
  const outputDir = args[1] // 默认输出目录

  const generator = new ApiGenerator()
  await generator.generate(filePath, outputDir)
}

main().catch(console.error)

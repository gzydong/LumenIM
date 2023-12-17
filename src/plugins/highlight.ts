import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/github.css'
import 'highlight.js/lib/common'
import hljs from 'highlight.js/lib/core'
import php from 'highlight.js/lib/languages/php'
import c from 'highlight.js/lib/languages/c'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import rust from 'highlight.js/lib/languages/rust'
import markdown from 'highlight.js/lib/languages/markdown'
import nginx from 'highlight.js/lib/languages/nginx'
import yaml from 'highlight.js/lib/languages/yaml'
import protobuf from 'highlight.js/lib/languages/protobuf'
import shell from 'highlight.js/lib/languages/shell'
import ini from 'highlight.js/lib/languages/ini'
import makefile from 'highlight.js/lib/languages/makefile'

hljs.registerLanguage('c', c)
hljs.registerLanguage('php', php)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('nginx', nginx)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('protobuf', protobuf)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('makefile', makefile)

export function setHljsVuePlugin(app) {
  app.use(hljsVuePlugin)
}

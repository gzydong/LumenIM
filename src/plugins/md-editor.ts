import { App } from 'vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs
})

export function setMdEditor(app: App) {
  app.use(VueMarkdownEditor)
}

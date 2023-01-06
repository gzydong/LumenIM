import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/lib/common'


export function setHljsVuePlugin(app){
    app.use(hljsVuePlugin)
}
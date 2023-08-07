import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/github.css'
import 'highlight.js/lib/common'


export function setHljsVuePlugin(app){
    app.use(hljsVuePlugin)
}
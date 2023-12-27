import dropsize from './dropsize'
import focus from './focus'
import loading from './loading'

const directives = {
  dropsize,
  focus,
  loading
}

export function setupDirective(app: any) {
  for (const key in directives) {
    app.directive(key, directives[key])
  }
}

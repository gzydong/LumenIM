import dropsize from './dropsize'
import focus from './focus'
// import paste from './paste'
import loading from './loading'
// import copy from './copy'

const directives = {
  dropsize,
  focus,
  // paste,
  loading
  // copy
}

export function setupDirective(app: any) {
  for (const key in directives) {
    app.directive(key, directives[key])
  }
}

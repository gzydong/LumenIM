import dropsize from './dropsize'
import focus from './focus'
import paste from './paste'
import drag from './drag'
import loading from './loading'
import copy from './copy'

export function setupDirective(app: any) {
  app.directive('dropsize', dropsize)
  app.directive('focus', focus)
  app.directive('paste', paste)
  app.directive('drag', drag)
  app.directive('loading', loading)
  app.directive('copy', copy)
}

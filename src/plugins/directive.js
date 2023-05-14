import dropsize from '@/directive/dropsize'
import focus from '@/directive/focus'
import paste from '@/directive/paste'
import drag from '@/directive/drag'

export function setupDirective(app) {
  app.directive('dropsize', dropsize)
  app.directive('focus', focus)
  app.directive('paste', paste)
  app.directive('drag', drag)
}

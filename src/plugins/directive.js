import dropsize from '@/directive/dropsize'
import focus from '@/directive/focus'
import paste from '@/directive/paste'
import drag from '@/directive/drag'
import loading from '@/directive/loading'
import copy from '@/directive/copy'

export function setupDirective(app) {
  app.directive('dropsize', dropsize)
  app.directive('focus', focus)
  app.directive('paste', paste)
  app.directive('drag', drag)
  app.directive('loading', loading)
  app.directive('copy', copy)
}

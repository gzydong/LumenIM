export function useChatAside() {
  const aside = reactive<{
    show: boolean
    component: any
    props: any
    width: number
    listeners: any
  }>({
    show: false,
    component: null,
    props: {},
    width: 200,
    listeners: {}
  })

  function setAsideComponent(component: any, width: number, props: any = {}, listeners = {}) {
    aside.show = true
    aside.component = shallowRef(component)
    aside.props = props
    aside.width = width
    aside.listeners = listeners
  }

  function closeAside() {
    aside.show = false
    aside.component = null
    aside.props = {}
    aside.width = 200
    aside.listeners = {}
  }

  return { aside, setAsideComponent, closeAside }
}

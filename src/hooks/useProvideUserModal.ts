import { ref, provide } from 'vue'

export function useProvideUserModal() {
  const isShow = ref(false)
  const uid = ref(0)

  const show = (id: number) => {
    uid.value = id
    isShow.value = true
  }

  const close = () => {
    uid.value = 0
    isShow.value = false
  }

  provide('$user', show)

  return { isShow, uid, show, close }
}

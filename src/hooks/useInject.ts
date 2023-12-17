import { inject } from 'vue'

export function useInject() {
  const user: any = inject('$user')

  const showUserInfoModal = (uid: number) => {
    user(uid)
  }

  return { showUserInfoModal }
}

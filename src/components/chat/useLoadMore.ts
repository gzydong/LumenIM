import { ref, nextTick } from 'vue'

export function useLoadMore(
  dataSourceMode: string,
  container: () => HTMLElement | null,
  fn?: () => Promise<boolean>
) {
  // 加载状态 1:正常 2:加载中 3:没有更多
  const loadStatus = ref(1)

  /**
   * 加载更多
   * @param reload 是否重置
   * @returns
   */
  async function toLoadMore(reload = false) {
    if (!fn) return

    if (!reload && loadStatus.value != 1) return

    const scrollHeight = container()?.scrollHeight || 0

    loadStatus.value = 2

    try {
      const isMore = await fn()
      loadStatus.value = isMore ? 1 : 3

      if (dataSourceMode == 'pulldown') {
        nextTick(() => {
          const el = container()
          if (el) {
            el.scrollTop = el.scrollHeight - scrollHeight
          }
        })
      }
    } catch (e) {
      loadStatus.value = 1
    }
  }

  return {
    loadStatus,
    toLoadMore
  }
}

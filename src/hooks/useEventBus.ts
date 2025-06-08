import { onMounted, onUnmounted } from 'vue'
import { bus } from '@/utils'

interface Event {
  name: any
  event: (data: any) => void
}

export const useEventBus = (items: Event[]) => {
  if (items.length) {
    onMounted(() => {
      for (const item of items) {
        bus.subscribe(item.name, item.event)
      }
    })

    onUnmounted(() => {
      for (const item of items) {
        bus.unsubscribe(item.name, item.event)
      }
    })
  }

  const emit = (channel: string, data: any) => {
    bus.emit(channel, data)
  }

  return { emit }
}

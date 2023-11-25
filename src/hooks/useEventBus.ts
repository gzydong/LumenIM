import { onMounted, onUnmounted } from 'vue'
import { bus } from '@/utils/event-bus'

interface Event {
  name: any
  event: Function
}

export const useEventBus = (items: Event[]) => {
  if (!items.length) return

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

  const emit = (channel: string, data: any) => {
    bus.emit(channel, data)
  }

  return { emit }
}

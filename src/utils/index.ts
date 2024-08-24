import EventBus from '@/plugins/event-bus'
import Storage from '@/plugins/storage'

export const storage = new Storage('im', localStorage)

export const bus = new EventBus()

<template>
  <div>{{ time }}</div>
</template>

<script>
import { beautifyTime } from '@/utils/functions'

export default {
  components: {},
  props: {
    value: {
      type: String,
    },
  },
  watch: {
    value() {
      this.setTime()
    },
  },
  data() {
    return {
      time: '',
      timeout: null,
    }
  },
  created() {
    this.setTime()
  },
  destroyed() {
    clearInterval(this.timeout)
  },
  methods: {
    setTime() {
      this.time = beautifyTime(this.value)

      let time = new Date().getTime()
      let inTime = new Date(this.value.replace(/-/g, '/')).getTime()

      clearInterval(this.timeout)

      if (time - inTime > 35 * 60 * 1000) {
        return
      }

      this.timeout = setTimeout(() => {
        this.setTime()
      }, 60 * 1000)
    },
  },
}
</script>

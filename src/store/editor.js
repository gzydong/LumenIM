import { defineStore } from 'pinia'
import { ServeFindUserEmoticon, ServeUploadEmoticon, ServeDeleteEmoticon } from '@/api/emoticon'
import { ServeCollectEmoticon } from '@/api/chat'

const message = window['$message']

export const useEditorStore = defineStore('editor', {
  state: () => {
    return {
      // 表包相关
      emoticon: {
        items: [
          {
            name: '系统表情',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAzFBMVEUAAAD7ywP7ywT80wH6wwb6xgX80wH6wwb7zwL7zgP5xAb7ywT5xAb5wgf7ywT80gH80gL7ywP80gH7ywT7zgP6yAX80wH5wQf80QL80wH6xgb81AH5wgf6xwX81AH5wQf81AH5wwb80gL5wQf7zgP5wgf80gH7zAP5wwb6ygT6xwX70AL7zgOudAD6xQb2wgXVnwLwvwPRmgLDigG1ewCxdwDgqQTcpgPYoQPrvALhsAG6gQHosgTntAP1yAPMlQLJkgLJkQK/hgG3fgAADXCMAAAAJnRSTlMATgT7znJxcHAM/fnz7uzs09HMqS4mJfry8u3t1tXVqqpcWy0tD14bIcIAAAGzSURBVDjLnZTXcsIwEEUdcAFCCy290GwgLHKld/7/n6IVljBGDgznxbtXZzSz9niVO+noP+X3dPq9/KN3kq2s/mVG+NKzUi2VKZkxSpnUpdeomBIqjbj38GpKeX0491ppM4F06+w+9JLMyJ2NF/MfXhpiXjGHnAqfPfN7hUz4nkvXxFKWiboI5u7sdDpz56LWmVgehswBgjVv1gHAnDdl9GpDjg0AM97MaGOLoxqOIjrHB8/ijeWB74gjHKdqCfqOFcHpn+oqFZ+sG3iiYvEWsUjFx1vERxT7N4Bi8VgOpAKPizgMFuQQrGTeKjgQfOIwVSyWAP5Acp8PwC7A16MNKCQAsAcX2AABwULDT8iiKQBM4t6EhlNW1RTKJys9Gm5IVCMbGnms/FQQ7RjvaezbDtcc26fBnrBGY2L2bYSQLSCLnTudursFIFvCjt7ClWGMjowXcMZiHB4Y/OdSw6A39kDgjXthrIrFUs/3OGQ5sV3XniyJiPL1yALI9RLJnS2VZi7Ra8aWVF7u5fl9groq89S6ZJEahbhWMFKKjK72EdU+tK6SSNv4VgvPzwX122gr9/EHUym1IM88uoYAAAAASUVORK5CYII='
          },
          {
            name: '我的收藏',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAC1klEQVRYw+2XX0hTcRTHP3eOCgOtNCOI/lBYvQSNXtL8t0yRgnI3yjCil7AQkggignwoiN7ypYcopB5cFtypkYRmm38yX6Sgl6YQRQSRpqWUhOhOD9vcmnO781p3D/vCYez3O7/z+9zf+e3uHEgpJXOlLDQhqmoB7MBhIA/YDKQDI8A7wAM0KZr2OdYGoqobgGqgBNgJ5ABTwEdgAGgF3Iqm+XQDiqqqwA0gN84DzgLNwBVF0z5FxNgYiFEFpMWJMwxcUjStLSagz+FYDtwDTiaYiZ9AncXlagzEqQLuABkJxmkEzllcrul5gD6Hwwo8ASoSDBquW4APuGggRhtw1OJyzQBYg6MiUm8QDuCCwfXgv/P1AfOf4Gzlka2ANxzYZM0AO9JaWt9bAEQ4L4JVBJLErCLUETwxETlo9pFFUcUcIMgWs2miaNMcoIhYzKaJoulwwAkg02yiCE2FAJHRJAQcDwGKeIFtZhNFaAjAf/dE+s1+r0SxgTlAEWkXEZLM2iHsv/hXRflrYLfZeQ3ozcpnHbZQigGBBvF/JoM1BLlCgCIPRcSbBKn1ikhzkOuvenCy/EAZ0GFyesszOp53RgUEmCgrdQInTIJzZnZ2VYcPzC+vRGoAG7D9P8MNAWcjB6P2JD9K7bvwNzTp/wluCti7qsv9VhcgwPfSkkOABiz7x3DTgLq6y/M02qQSa+X4/uJq4AHxu7LFygecWvOiu2khByVehDF70Rn8HVpc3wQlQE2Wu+duLCddm47ZC48D94EVSwT3Gzid5e59FM9R96l8KynYAzwGjFbfH4Bj2Z6+QT3OuivpbE/foAg2EZwGihSnCDa9cAmdYLhGi/dVAreB9TqXfAFq13a/bEl0r0Vf/JGi/AzgGlDLwv30TOBB6nN6+icXs4/hX+ZIUX4ucBOojJhqAS7n9PQPG4m/ZK+Or4V5BcD1wNer63pf9S1V7JRSMlN/AO6lbgA7RvQLAAAAAElFTkSuQmCC',
            children: []
          }
        ]
      }
    }
  },
  actions: {
    // 加载用户表情包
    loadUserEmoticon() {
      ServeFindUserEmoticon().then((res) => {
        if (res.code == 200) {
          const { collect_emoticon } = res.data

          // 用户收藏的系统表情包
          this.emoticon.items[1].children = collect_emoticon || []
        }
      })
    },

    // 收藏用户表情包
    saveUserEmoticon(resoure) {
      ServeCollectEmoticon({
        record_id: resoure.record_id
      }).then((res) => {
        if (res.code == 200) {
          this.loadUserEmoticon()
        } else {
          message.warning(res.message)
        }
      })
    },

    // 自定义上传用户表情包
    uploadUserEmoticon(file) {
      const data = new FormData()
      data.append('emoticon', file)

      ServeUploadEmoticon(data).then((res) => {
        if (res.code == 200) {
          this.emoticon.items[1].children.unshift(res.data)
        } else {
          message.warning(res.message)
        }
      })
    },

    // 自定义上传用户表情包
    removeUserEmoticon(resoure) {
      ServeDeleteEmoticon({
        ids: [resoure.id].join(',')
      }).then((res) => {
        if (res.code == 200) {
          this.emoticon.items[1].children.splice(resoure.index, 1)
          message.success('删除成功')
        } else {
          message.warning(res.message)
        }
      })
    }
  }
})

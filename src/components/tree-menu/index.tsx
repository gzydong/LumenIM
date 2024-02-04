import { defineComponent } from 'vue'
import '@/components/tree-menu/index.less'

// 引入并使用您提供的Menu接口
interface Menu {
  name: string
  icon?: string
  isShowInput?: boolean
  isNewNode?: boolean
  children?: Menu[]
}

export default defineComponent(
  (props) => {
    console.log(props.menu)

    const ms = (index: number, m: Menu) => {
      return (
        <>
          <div
            class={{
              'menu-item': true,
              ['menu-item-' + index]: true
            }}
            style={{
              'margin-left': (index - 1) * 15 + 'px'
            }}
          >
            <div class="menu-item-name">
              {m.isShowInput ? (
                <input
                  class="menu-item-input"
                  value={m.name}
                  placeholder="请输入菜单名称"
                  v-focus
                  onKeyup={(e) => {
                    m.name = (e.target as HTMLInputElement).value
                    console.log('onKeyup', m.name)
                    m.isShowInput = false
                  }}
                  onBlur={(e) => {
                    m.name = (e.target as HTMLInputElement).value
                    console.log('onKeyup', m.name)
                    m.isShowInput = false
                  }}
                  onInput={(e) => {
                    m.name = (e.target as HTMLInputElement).value
                  }}
                />
              ) : (
                <div class="menu-item-text">{m.name}</div>
              )}
            </div>

            {m.children?.map((m) => {
              return ms(index + 1, m)
            })}
          </div>
        </>
      )
    }

    const rn = () => {
      return (
        <div class="menu-list">
          {props.menu.map((m) => {
            return ms(1, m)
          })}
        </div>
      )
    }

    return () => {
      // 渲染函数或 JSX
      return rn()
    }
  },
  // 其他选项，例如声明 props 和 emits。
  {
    props: {
      menu: {
        type: Array as () => Menu[],
        required: true
      }
    }
  }
)

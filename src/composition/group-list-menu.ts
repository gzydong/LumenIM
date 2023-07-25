import { reactive, h } from 'vue'

interface IDropdown {
    options: DropdownOption[]
    show: boolean
    x: number
    y: number
    item: any
}

import { useMessage, NAvatar, NText } from "naive-ui";

function renderCustomHeader() {
    return h(
        "div",
        {
            style: "display: flex;  padding: 8px 12px;width:200px;"
        },
        [
            h(NAvatar, {
                round: true,
                style: "margin-right: 12px;",
                src: "https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG"
            }),
            h("div", null, [
                h("div", null, [h(NText, { depth: 2 }, { default: () => "打工仔" })]),
                h("div", { style: "font-size: 12px;" }, [
                    h(
                        NText,
                        { depth: 3 },
                        { default: () => "毫无疑问，你是办公室里最亮的星" }
                    )
                ])
            ])
        ]
    );
}

export function useFriendsMenu() {
    const dropdown: IDropdown = reactive({
        options: [],
        show: false,
        x: 0,
        y: 0,
        item: {},
    })

    const showDropdownMenu = (e: any, item: any) => {
        dropdown.item = Object.assign({}, item)

        dropdown.options = []

        dropdown.options.push({ label: '添加好友', key: 'delete2' })
        dropdown.options.push({ label: '移出群聊', key: 'delete1' })
        dropdown.options.push({ label: '禁止发言', key: 'delete3' })
        dropdown.options.push({ label: '权限分配', key: 'delete4' })
        dropdown.options.push({ label: '@群成员', key: 'delete5' })

        dropdown.x = e.clientX
        dropdown.y = e.clientY
        dropdown.show = true
    }

    const closeDropdownMenu = () => {
        dropdown.show = false
        dropdown.item = {}
    }

    return { dropdown, showDropdownMenu, closeDropdownMenu }
}

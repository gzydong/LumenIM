let str = `
没法考试领导们吗克拉霉素地方 <img src="default.png" class="emoji" data-text="[在吗]" />
罚款收到了吗罚款我饿了马利克舒服点吗<img src="default1.png" class="emoji" data-text="[你好]" /> 是的发生大
<img src="default3.png" class="emoji" data-text="[稍等]" /> 发伺机待发了吗圣诞快乐发吗`

let pattern = /\<img src=".*?" class="emoji" data-text="(.*?)".*?\>/g;
let result = str.replace(pattern, '$1');
console.log(result);
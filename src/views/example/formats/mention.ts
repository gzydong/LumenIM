import Quill from 'quill';

const BlockEmbed = Quill.import('blots/embed');

class MentionBlot extends BlockEmbed {
    static blotName = 'mention';
    static tagName = 'span';
    static className = 'ed-mention';

    static create(value: HTMLTextAreaElement) {
        const node = super.create(value);

        node.setAttribute('contenteditable', false);
        node.textContent = value.nickname;
        node.dataset.uid = value.uid;
        node.dataset.nickname = value.nickname;

        return node;
    }

    static formats(value: HTMLTextAreaElement) {
        // 主要在有初始值时起作用
        return {
            nickname: value.dataset.nickname,
            uid: value.dataset.uid,
        };
    }

    static value(value: HTMLTextAreaElement) {
        // 主要在有初始值时起作用
        return {
            nickname: value.dataset.nickname,
            uid: value.dataset.uid,
        };
    }
}

export default MentionBlot;
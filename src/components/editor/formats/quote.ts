import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class QuoteBlot extends BlockEmbed {
    static blotName = 'quote';
    static tagName = 'div';
    static className = 'quote-card';

    static create(value): any {
        const node = super.create(value);

        const { id, title, describe, image } = value;

        node.dataset.id = id
        node.dataset.title = title
        node.dataset.describe = describe
        node.dataset.image = image

        node.setAttribute('contenteditable', 'false');

        const quoteCardContent = document.createElement('span');
        quoteCardContent.classList.add('quote-card-content');

        const quoteCardTitle = document.createElement('span');
        quoteCardTitle.classList.add('quote-card-title');
        quoteCardTitle.textContent = title;
        quoteCardContent.appendChild(quoteCardTitle);

        if (image.length == 0) {
            const quoteCardMeta = document.createElement('span');
            quoteCardMeta.classList.add('quote-card-meta');
            quoteCardMeta.textContent = describe;
            quoteCardContent.appendChild(quoteCardMeta);
        } else {
            const iconImg = document.createElement('img');
            iconImg.setAttribute('src', image);
            iconImg.style = 'max-width:30px;max-height:30px;'
            quoteCardContent.appendChild(iconImg);
        }

        node.appendChild(quoteCardContent);

        return node;
    }

    static value(node): any {
        return {
            id: node.dataset.id,
            title: node.dataset.title,
            describe: node.dataset.describe,
            image: node.dataset.image,
        };
    }
}

export default QuoteBlot;

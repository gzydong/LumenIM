import Clipboard from 'clipboard';
import {
  Message
} from 'element-ui';

function clipboardSuccess() {
  Message({
    message: '恭喜你，复制成功...',
    type: 'success'
  });
}

function clipboardError() {
  Message('恭喜你，复制失败...');
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  });

  clipboard.on('success', () => {
    clipboardSuccess();
    clipboard.destroy();
  });

  clipboard.on('error', () => {
    clipboardError();
    clipboard.destroy();
  });

  clipboard.onClick(event);
}

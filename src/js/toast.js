import { createNode } from './helper';

export const removeToast = () => {
  document.querySelector('.toast').remove();
};

export const notification = (message, statusColor) => {
  const toast = createNode('div', 'toast', statusColor);
  const para = createNode('p', 'toast__text');
  para.innerText += message;

  const closeBtn = createNode('span', 'close-button');
  closeBtn.addEventListener('click', removeToast);
  toast.append(para, closeBtn);
  setTimeout(() => {
    toast.remove();
  }, 3000);
  return toast;
};

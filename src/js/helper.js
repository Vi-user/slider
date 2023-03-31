// export const BASE_URL = 'http://127.0.0.1:8000';
export const BASE_URL = 'https://server-test-task.onrender.com';

export const createNode = (tag, ...classes) => {
  const node = document.createElement(tag);
  node.classList.add(...classes);
  return node;
};

const imgContainer = Array.from(document.getElementById('images_container').children);

export const drawLastImages = (list) => {
  list.forEach((img, i) => {
    imgContainer[i].style.backgroundImage = `url(${BASE_URL}/${img})`;
    imgContainer[i].style.backgroundSize = 'cover';
  });
};

export const deleteImages = () => {
  imgContainer.forEach((el) => {
    el.style.backgroundImage = '';
  });
};

import './index.scss';
import { clearGallery, getImagesList, saveImage } from './js/api';
import { BASE_URL, deleteImages, drawLastImages } from './js/helper';
import { notification } from './js/toast';
import { isAllowedDimensions, isImage } from './js/image_validation';

const generalBG = document.getElementById('bg-img');
const leftBtn = document.getElementById('btn-left');
const rightBtn = document.getElementById('btn-right');
let curImgInd = 0;
let timer = 0;
let sortedImages = [];
const TIME_WITHOUT_MOVE = 15;

window.onload = async function () {
  sortedImages = await getImagesList();
  if (sortedImages.length) {
    drawLastImages(sortedImages.slice(-3));
    generalBG.firstElementChild.style.background = `url(${BASE_URL}/${sortedImages[curImgInd]})`;
  } else {
    generalBG.firstElementChild.style.backgroundImage = `url('./assets/img/defaultBG.jpg')`;
  }
};

const changeBG = (directionCur, directionNew) => {
  // leftBtn.removeEventListener('click', addLeftClickHandler);
  // rightBtn.removeEventListener('click', addRightClickHandler);
  const сurContainer = document.querySelector('.background');
  сurContainer.classList.add(directionCur);
  const newContainer = document.createElement('div');
  newContainer.classList.add('background', directionNew);
  newContainer.style.background = `url(${BASE_URL}/${sortedImages[curImgInd]})`;
  newContainer.style.backgroundSize = 'cover';
  generalBG.append(newContainer);
  setTimeout(() => {
    сurContainer.remove();
    newContainer.classList = 'background';
    // leftBtn.addEventListener('click', addLeftClickHandler);
    // rightBtn.addEventListener('click', addRightClickHandler);
    if (generalBG.childNodes.length > 1) {
      const children = generalBG.childNodes;
      for (let i = 0; i < children.length - 1; i++) {
        children[i].remove()
      }
    }
  }, 3000);
};

const addLeftClickHandler = () => {
  if (sortedImages.length <= 1) return;
  curImgInd = curImgInd === 0 ? sortedImages.length - 1 : curImgInd - 1;
  changeBG('transition-to-down', 'transition-from-up');
};

leftBtn.addEventListener('click', addLeftClickHandler);

const addRightClickHandler = () => {
  if (sortedImages.length <= 1) return;
  curImgInd = curImgInd === sortedImages.length - 1 ? 0 : curImgInd + 1;
  changeBG('transition-to-up', 'transition-from-down');
};

rightBtn.addEventListener('click', addRightClickHandler);

const clearTimer = () => {
  timer = 0;
};

const keyPressHandler = (e) => {
  if (sortedImages.length <= 1) return;
  if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
    addRightClickHandler();
    return;
  }
  if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
    addLeftClickHandler();
    return;
  }
}

const userActivityHandler = () => {
  setInterval(() => {
    timer++;
    if (timer >= TIME_WITHOUT_MOVE && timer % 5 === 0) {
      curImgInd = curImgInd === sortedImages.length - 1 ? 0 : curImgInd + 1;
      changeBG('transition-to-left', 'transition-from-right');
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', () => userActivityHandler());
document.addEventListener('mousemove', () => clearTimer());
document.addEventListener('scroll', () => clearTimer());
document.addEventListener('click', () => clearTimer());
document.addEventListener('keydown', (e) => {
  keyPressHandler(e);
  clearTimer()
});

const fileInput = document.querySelector('#upload_file');
fileInput.addEventListener('change', async (e) => {
  const image = fileInput.files[0];

  const validImg = isImage(image);
  if (!validImg) {
    const errorToast = notification('Only images are allowed to upload', 'toast_error');
    document.querySelector('body').append(errorToast);
    e.target.value = '';
    return;
  }

  const resolutionImg = await isAllowedDimensions(image);
  if (!resolutionImg) {
    const errorToast = notification(
      'The dimensions of the images should be  1920 * 1080',
      'toast_error',
    );
    document.querySelector('body').append(errorToast);
    e.target.value = '';
    return;
  }

  const { responseStatus, message, fileName } = await saveImage(image);
  if (responseStatus === 201) {
    sortedImages.push(fileName);
    drawLastImages(sortedImages.slice(-3));
    if (sortedImages.length === 1) {
      generalBG.firstElementChild.style.background = `url(${BASE_URL}/${sortedImages[curImgInd]})`;
    }
    const newToast = notification(message, 'toast_success');
    document.querySelector('body').append(newToast);
  } else {
    const errorToast = notification(message, 'toast_error');
    document.querySelector('body').append(errorToast);
  }
  e.target.value = '';
});

const clearGalleryHandler = async (e) => {
  e.preventDefault();

  // if (!sortedImages.length) {
  //   const newToast = notification('Gallery is empty', 'toast_error')
  //   document.querySelector('body').append(newToast);
  //   return;
  // }
  const { responseStatus, responseMessage } = await clearGallery();
  if (responseStatus === 200) {
    const newToast = notification(responseMessage, 'toast_success');
    document.querySelector('body').append(newToast);
    sortedImages = [];
    deleteImages();
    generalBG.firstElementChild.style.background = `url('./assets/img/defaultBG.jpg')`;
    generalBG.firstElementChild.style.backgroundSize = 'cover';
  } else {
    const newToast = notification(responseMessage, 'toast_error');
    document.querySelector('body').append(newToast);
  }
};

const clearGalleryBtn = document.getElementById('clear_gallery');
clearGalleryBtn.addEventListener('click', clearGalleryHandler);

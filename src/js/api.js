import { BASE_URL } from './helper';

export const getImagesList = async () => {
  const response = await fetch(`${BASE_URL}/images`);
  const { imagesList } = await response.json();
  return imagesList;
};

export const clearGallery = async () => {
  try {
    const response = await fetch(`${BASE_URL}/images`, {
      method: 'DELETE',
    });
    const responseStatus = response.status;
    const responseMessage = await response.text();
    return { responseStatus, responseMessage };
  } catch (e) {
    console.log('clearGallery', e);
  }
};

export const saveImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  try {
    const response = await fetch(`${BASE_URL}/images`, {
      method: 'POST',
      body: formData,
    });
    const responseStatus = response.status;
    const { message, fileName } = await response.json();
    return { responseStatus, message, fileName };
  } catch (e) {
    console.log('saveImage', e);
  }
};

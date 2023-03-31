const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ALLOWED_WIDTH = 1920;
const ALLOWED_HEIGHT = 1080;

export const isImage = (file) => {
  return ALLOWED_MIME_TYPES.includes(file.type);
};

async function getImageDimensions(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const width = img.width;
  const height = img.height;
  // URL.revokeObjectURL(img.src);
  return {
    width,
    height,
  };
}

export const isAllowedDimensions = async (file) => {
  const { width, height } = await getImageDimensions(file);
  return width === ALLOWED_WIDTH && height === ALLOWED_HEIGHT;
};

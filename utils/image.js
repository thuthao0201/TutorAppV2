const convertImageToHttpUrl = (image) => {
  if (!image) {
    return null;
  }
  if (image.includes("http")) {
    return image;
  }
  return "http://192.168.1.226:3000" + image;
};

export { convertImageToHttpUrl };

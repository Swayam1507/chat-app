const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const uploadImageToCloudStorage = async (image, bucket) => {
    console.log(image,'image')
    const file = storage.bucket(bucket).file(image.originalname);
    const signedUrl = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });
  
    try {
      const response = await fetch(signedUrl[0], {
        method: 'PUT',
        body: image,
        headers: {
          'Content-Type': image.mimetype,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
  
      await file.makePublic();
  
      return `https://storage.googleapis.com/${bucket}/${image.name}`;
    } catch (error) {
      throw error;
    }
  };
  module.exports = uploadImageToCloudStorage;
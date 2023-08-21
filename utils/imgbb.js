import axios from 'axios';
import fs from 'fs';

const uploadToImgbb = async (filePath) => {
  try {
    const apiUrl = "https://api.imgbb.com/1/upload";
    const apiKey = process.env.IMGBB_API;

    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post(apiUrl, formData, {
      headers: formData.getHeaders(), // Corrige esta línea
      params: {
        key: apiKey
      }
    });

    if (response.data && response.data.data && response.data.data.url) {
      return {
        url: response.data.data.url,
        public_id: response.data.data.id
      };
    }

    throw new Error("Error uploading image to imgbb");
  } catch (error) {
    throw error;
  } finally {
    // Limpiamos el archivo de la imagen del servidor local.
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export default uploadToImgbb;

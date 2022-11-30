import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_KEY, CLOUDINARY_CLOUD_SECRET } from '../config.js'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_CLOUD_KEY,
  api_secret: CLOUDINARY_CLOUD_SECRET,
  secure: true
});

export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'dlcards'
  })
}

export async function deleteImage(publicId) {
  return await cloudinary.uploader.destroy(publicId)
}

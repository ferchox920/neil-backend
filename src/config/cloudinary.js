import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import  fs  from "fs-extra";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

export async function uploadImageProduct(file) {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "coder/products", 
  });
  await fs.unlink(file.tempFilePath); 
  return result;
}

export async function uploadImageProfile(file) {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "coder/profile",
  });
  await fs.unlink(file.tempFilePath)
  return result;
}

export async function deleteImageProduct(id) {
  const result = await cloudinary.uploader.destroy(id);
  return result;
}

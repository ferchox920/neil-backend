import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

export async function uploadImageProduct(file) {
  const result = await cloudinary.uploader.upload(file, {
    folder: "/coder/products",
  });
  return result;
}

export async function uploadImageProfile(file) {
  const result = await cloudinary.uploader.upload(file, {
    folder: "/coder/profile",
  });
  return result;
}

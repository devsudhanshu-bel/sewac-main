import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadImage = (file, folder = "sewac") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          publicId: result.public_id,
          imageUrl: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export default uploadImage;
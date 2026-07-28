import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload(
      "D:/test_run.png",
      {
        folder: "sewac/test",
      }
    );

    console.log("\n✅ Upload Successful!\n");
    console.log("Public ID :", result.public_id);
    console.log("Image URL :", result.secure_url);
  } catch (error) {
    console.error("\n❌ Upload Failed\n");
    console.error(error);
  }
}

testUpload();
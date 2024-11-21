// testEnv.js
import dotenv from 'dotenv';
dotenv.config();

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API:', process.env.CLOUDINARY_API);
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET);

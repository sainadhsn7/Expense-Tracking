import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,    
  api_secret: process.env.CLOUDINARY_SECRET
});

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API:', process.env.CLOUDINARY_API);
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET);

// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API || !process.env.CLOUDINARY_SECRET) {
//   throw new Error('Cloudinary configuration is missing environment variables');
// };
 
if(!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('Cloudinary configuration is missing CLOUDINARY_CLOUD_NAME');
}

if(!process.env.CLOUDINARY_API) {
  throw new Error('Cloudinary configuration is missing CLOUDINARY_API');
}

if(!process.env.CLOUDINARY_SECRET) {
  throw new Error('Cloudinary configuration is missing CLOUDINARY_SECRET');
}

export default cloudinary;

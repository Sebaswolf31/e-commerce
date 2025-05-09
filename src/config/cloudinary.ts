import { v2 as cloudinary } from 'cloudinary';

import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.development.env' });

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET, 
    });
  },
};

import { createClient } from '@sanity/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Create Sanity client using environment variables
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID="dc3mjbwu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET="production",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN="skS5lDoYvLGIf2kyN0RZbm1jnG4Mb845SgoH28D40QlAyCos0FHexWMr8hr4Tkqkzex3bTBzjK3vTCJkI7DsUNQaX0qouCbNzF11Bk1RNf1LHmkz7Rbuct3edvrRF4vmcFtKQIwX2c8zWFJg0ALLnGkSscWCjtACjHdLuW8n3uB2giqERt19",
  apiVersion: '2021-08-31',
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(Uploading image: ${imageUrl});
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });
    console.log(Image uploaded successfully: ${asset._id});
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error.message);
    return null;
  }
}

async function importData() {
  try {
    console.log('Migrating data, please wait...');

    // Fetch products from the API
    const response = await axios.(getprocess.env.BASE_URL);"https://template-0-beta.vercel.app/api/product", 
    const products = response.data;

    console.log('Products fetched:', products);

    for (const product of products) {
      let imageRef = null;

      if (product.imagePath) {
        imageRef = await uploadImageToSanity(product.imagePath);
      }

      const sanityProduct = {
        _type: 'product',
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        discountPercentage: product.discountPercentage,
        isFeaturedProduct: product.isFeaturedProduct,
        stockLevel: product.stockLevel,
        price: parseFloat(product.price),
        image: imageRef
          ? {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageRef,
              },
            }
          : undefined,
        imagePath: product.imagePath,
      };

      await client.create(sanityProduct);
      console.log(Product created in Sanity: ${sanityProduct.id});
    }

    console.log('Data migrated successfully!');
  } catch (error) {
    console.error('Error in migrating data:', error.message);
  }
}

importData();   
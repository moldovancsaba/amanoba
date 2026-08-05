/**
 * Set Default Course Thumbnail in Brand Metadata
 */

import connectDB from '../app/lib/mongodb';
import Brand from '../app/lib/models/brand';

async function setDefaultThumbnail() {
  console.log('🖼️  Setting default course thumbnail...\n');
  
  await connectDB();
  
  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    console.log('❌ Brand not found');
    process.exit(1);
  }
  
  console.log('Current metadata:', JSON.stringify(brand.metadata, null, 2));
  
  // Set default course thumbnail to a nice education/learning image
  brand.metadata = {
    ...brand.metadata,
    defaultCourseThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
  };
  
  await brand.save();
  
  console.log('\n✅ Updated brand with default thumbnail');
  console.log('New metadata:', JSON.stringify(brand.metadata, null, 2));
  console.log('\nDefault thumbnail URL: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80');
  
  process.exit(0);
}

setDefaultThumbnail().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

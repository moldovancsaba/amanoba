/**
 * IMGBB Image Upload Utility
 * 
 * What: Uploads images to IMGBB.com CDN
 * Why: Provides reliable image hosting and CDN for course thumbnails
 */

import { logger } from '@/lib/logger';

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Upload image to IMGBB
 * 
 * @param imageFile - File object or base64 string
 * @param apiKey - IMGBB API key (from environment variable)
 * @returns IMGBB response with image URL
 */
export async function uploadToImgBB(
  imageFile: File | string,
  apiKey: string
): Promise<ImgBBResponse> {
  try {
    const formData = new FormData();
    
    // Handle both File and base64 string
    if (typeof imageFile === 'string') {
      // Base64 string
      formData.append('image', imageFile);
    } else {
      // File object
      formData.append('image', imageFile);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, 'IMGBB upload failed');
      throw new Error(`IMGBB upload failed: ${response.status} ${errorText}`);
    }

    const data: ImgBBResponse = await response.json();

    if (!data.success) {
      logger.error({ data }, 'IMGBB upload returned success=false');
      throw new Error('IMGBB upload failed: API returned success=false');
    }

    logger.info({ imageId: data.data.id, url: data.data.url }, 'Image uploaded to IMGBB successfully');
    return data;
  } catch (error) {
    logger.error({ error }, 'Failed to upload image to IMGBB');
    throw error;
  }
}

/**
 * Convert File to base64 string
 * 
 * @param file - File object
 * @returns Promise<string> - Base64 encoded string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

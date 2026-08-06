/**
 * ImgBB Image Upload Service
 * 
 * What: Uploads images (certificate PNGs) to ImgBB for external hosting
 * Why: Provides reliable, fast, CDN-backed URLs for certificate sharing and downloads
 * 
 * ImgBB API: https://api.imgbb.com/
 * Free tier: Unlimited uploads, permanent hosting
 */

interface ImgBBUploadResponse {
  success: boolean;
  status: number;
  data?: {
    id: string;
    title: string;
    url_viewer: string;
    url: string; // Direct image URL
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
    medium?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  error?: {
    message: string;
    code: number;
  };
}

interface UploadResult {
  success: boolean;
  url?: string;
  deleteUrl?: string;
  viewerUrl?: string;
  error?: string;
}

/**
 * Upload a base64-encoded image to ImgBB
 * 
 * @param base64Image - Base64-encoded image data (with or without data URI prefix)
 * @param name - Optional name for the image (defaults to timestamp)
 * @returns Upload result with image URL or error
 */
export async function uploadToImgBB(
  base64Image: string,
  name?: string
): Promise<UploadResult> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'IMGBB_API_KEY is not configured',
    };
  }

  try {
    // Remove data URI prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Prepare form data
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Data);
    if (name) {
      formData.append('name', name);
    }

    // Upload to ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as ImgBBUploadResponse;

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error?.message || `ImgBB upload failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      url: data.data?.url,
      deleteUrl: data.data?.delete_url,
      viewerUrl: data.data?.url_viewer,
    };
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

/**
 * Upload a buffer (PNG/JPEG) to ImgBB
 * 
 * @param buffer - Image buffer
 * @param name - Optional name for the image
 * @returns Upload result with image URL or error
 */
export async function uploadBufferToImgBB(
  buffer: Buffer,
  name?: string
): Promise<UploadResult> {
  const base64 = buffer.toString('base64');
  return uploadToImgBB(base64, name);
}

/**
 * Upload a Blob to ImgBB
 * 
 * @param blob - Image blob
 * @param name - Optional name for the image
 * @returns Upload result with image URL or error
 */
export async function uploadBlobToImgBB(
  blob: Blob,
  name?: string
): Promise<UploadResult> {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return uploadBufferToImgBB(buffer, name);
}

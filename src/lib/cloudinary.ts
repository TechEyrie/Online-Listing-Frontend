/**
 * Build a Cloudinary delivery URL with width/quality transforms when possible.
 * Falls back to the original URL for non-Cloudinary assets.
 */
export function cloudinaryImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string | number } = {},
): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const width = options.width ?? 800;
  const height = options.height;
  const quality = options.quality ?? 'auto';
  const transforms = [`f_auto`, `q_${quality}`, `w_${width}`, ...(height ? [`h_${height}`, 'c_fill'] : ['c_limit'])].join(
    ',',
  );

  return url.replace('/upload/', `/upload/${transforms}/`);
}

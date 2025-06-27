export async function loadImageBitmap(source) {
  if (typeof source === 'string') {
    const res = await fetch(source);
    source = await res.blob();
  }
  return await createImageBitmap(source, { colorSpaceConversion: 'none' });
  // return await createImageBitmap(source, { colorSpaceConversion: 'default' });
}

export function getRandomImageUrl() {
  const w = Math.floor(Math.random() * 10) * 100 + 500;
  const h = Math.floor(Math.random() * 10) * 100 + 500;
  return `https://placedog.net/${w}/${h}?random`;
}

export function downloadImageBitmap(bitmap, filename) {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to convert canvas to Blob.');
      return;
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 'image/png');
}

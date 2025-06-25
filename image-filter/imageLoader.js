export async function loadImageBitmap(source) {
  if (typeof source === 'string') {
    const res = await fetch(source);
    source = await res.blob();
  }
  return await createImageBitmap(source, { colorSpaceConversion: 'none' });
}

export const getRandomImageUrl = () => {
  const w = Math.floor(Math.random() * 10) * 100 + 500;
  const h = Math.floor(Math.random() * 10) * 100 + 500;
  return `https://placedog.net/${w}/${h}?random`;
};

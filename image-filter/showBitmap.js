export function showImageBitmap(imageBitmap, canvas) {
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const bm = canvas.getContext('bitmaprenderer');
    bm.transferFromImageBitmap(imageBitmap);
    document.body.appendChild(canvas);
}
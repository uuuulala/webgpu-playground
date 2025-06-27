export function getImageData(imageBitmap) {
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function computeHistogram(numBins, imgData) {
    const {width, height, data} = imgData;
    const rBins = new Array(numBins).fill(0);
    const gBins = new Array(numBins).fill(0);
    const bBins = new Array(numBins).fill(0);

    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            rBins[r]++;
            gBins[g]++;
            bBins[b]++;
        }
    }
    return {rBins, gBins, bBins};
}

export function drawHistogram(hist, numEntries, height = 100) {
    const {rBins, gBins, bBins} = hist;
    const canvas = document.getElementById('histogram-canvas');
    const ctx = canvas.getContext('2d');
    const numBins = rBins.length;
    canvas.width = numBins;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const max = Math.max(...rBins, ...gBins, ...bBins);
    const scale = height / max;

    ctx.globalCompositeOperation = 'source-over'; // Standard blending

    function drawCurve(bins, color) {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x < numBins; ++x) {
            const y = height - bins[x] * scale;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(numBins - 1, height);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.1;
        ctx.fill();

        ctx.globalAlpha = 1.;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    drawCurve(rBins, 'red');
    drawCurve(gBins, 'green');
    drawCurve(bBins, 'blue');
}
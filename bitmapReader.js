// Function to read a bitmap file from a URL


function readBitmap(url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            // get the bitmap data
            var dataView = new DataView(arrayBuffer);

            // get file info from bpm header 
            var width = dataView.getUint32(18, true);
            var height = dataView.getUint32(22, true);
            let colorArr = create2DArray(width, height)



            var pixelArrayOffset = dataView.getUint32(10, true); // the offset for where the first pixel's first byte is

            let padding = (4 - (width * 3) % 4) % 4 //bmp wants each row of the picture to start at a bytevalue with a multiple of 4. so they added padding at the end of rows.
            let tre;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    let pixelOffset = pixelArrayOffset + x * 3 + y * width * 3 + padding * y
                    let red = dataView.getUint8(pixelOffset + 2)
                    let green = dataView.getUint8(pixelOffset + 1)
                    let blue = dataView.getUint8(pixelOffset)
                    // console.log(x, y, ": ", red, green, blue)
                    let colorValue = readRGB(red, green, blue)
                    //console.log(colorValue)

                    colorArr[Math.abs(y-height)-1].push({ color: colorValue, x: x, y: y })
                }


            }
        })
        .catch(error => {
            console.error("Error reading bitmap:", error);
        });
}
function readRGB(red, green, blue) {
    const rgbMap = new Map();

    let key = String(red) + String(green) + String(blue)

    rgbMap.set('25500', 'red');
    rgbMap.set('123', 'black');
    rgbMap.set('1257653', 'brown');
    rgbMap.set('000', 'air');
    return rgbMap.get(key)


}

function create2DArray(x, y) {
    const array = new Array(x);

    for (let i = 0; i < x; i++) {
        array[i] = new Array(y);
    }

    return array;
}



readBitmap('assets/10x10.bmp');


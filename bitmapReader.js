// Function to read a bitmap file from a URL


export async function readBitmap(url) {
    console.log(url)
    let objArr
    try {
        const response = await fetch(url);
        console.log(response)
        const arrayBuffer = await response.arrayBuffer();
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

                colorArr[Math.abs(y - height) - 1].push({ objectType: colorValue, x: x, y: y, checked: false })
            }


        }
        
        objArr = parseObjects(colorArr, width, height)

        return objArr

    } catch (error) {
        console.error("Error reading bitmap:", error);
        throw error;

    }
}


function readRGB(red, green, blue) {
    const rgbMap = new Map();

    let key = String(red) + String(green) + String(blue)

    rgbMap.set('25500', 'red');
    rgbMap.set('123', 'black');
    rgbMap.set('1257653', 'platform');
    rgbMap.set('000', 'air');
    return rgbMap.get(key)
}

function create2DArray(x, y) {
    const array = new Array(x);

    for (let i = 0; i < x; i++) {
        array[i] = new Array;
    }

    return array;
}

function parseObjects(matrix, width, height) {
    let objArr = []
    for (let row = height - 1; row >= 0; row--) {
        for (let col = 0; col < width; col++) {
            if (matrix[row][col].objectType !== 'air' && !matrix[row][col].checked) {
                objArr.push(getObjectRect(matrix, row, col, width, height))
            }
        }
    }
    //console.log(objArr)
    return objArr
}

function getObjectRect(matrix, row, col, width, height) {
    let x = 1
    let y = 0
    let cell = matrix[row][col]
    let findType = cell.objectType
    for (let i = row; i >= 0; i--) {

        if (matrix[i][col].objectType !== findType || matrix[i][col].checked) {
            // console.log([x,y], row, col)
            return { objectType: findType, x: col, y: Math.abs(row - height) - 1, width: x, height: y }
        } else {
            y++
            matrix[i][col].checked = true
        }

        for (let j = col; j < width; j++) {
            if (matrix[i][j].objectType !== findType || matrix[i][j].checked) {
                break;
            } else {
                x++
                matrix[i][j].checked = true
            };
        }

    }
}





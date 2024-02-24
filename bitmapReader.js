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
        let colorArr = create2DArray(height)


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
                //console.log(x, y, colorValue)

                colorArr[Math.abs(y - height) - 1].push({ objectType: colorValue, x: x, y: y, checked: false })
            }


        }

        objArr = parseObjects(colorArr, width, height)
        console.log(colorArr)

        return objArr

    } catch (error) {
        console.error("Error reading bitmap:", error);
        throw error;

    }
}


function readRGB(red, green, blue) {
    const rgbMap = new Map();
    //console.log(red,green,blue)
    let key = String(red) + String(green) + String(blue)

    rgbMap.set('02550', 'green'); //green solid
    rgbMap.set('00255', 'blue'); //blue platform
    rgbMap.set('25500', 'red');//red hazard
    rgbMap.set('2552550', 'yellow'); //yellow collectible
    rgbMap.set('0255255', 'cyan'); //cyan spawn
    rgbMap.set('255255255', 'invisible');//white invisible
    rgbMap.set('000', 'air');//black air
    rgbMap.set('1257653', "brown")
    return rgbMap.get(key)
}

function create2DArray(y) {
    const array = new Array(y);

    for (let i = 0; i < y; i++) {
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
    let xCount = 0
    let yCount = 0
    let xLen = 0
    let worldWidth = width;
    let cell = matrix[row][col]
    let findType = cell.objectType
    if (width + col > worldWidth) {
        width = worldWidth - col
    }
    for (let i = row; i >= 0; i--) {
        for (let j = col; j < width + col; j++) {
            if (matrix[i][j].objectType === findType && !matrix[i][j].checked) {
                xCount++
            } else if (matrix[i][j].objectType !== findType && xLen > xCount) {
                markChecked(matrix, col, row, xLen, yCount, findType)
                return { objectType: findType, x: col, y: Math.abs(row - height) - 1, width: xLen, height: yCount }
            }

            else if (matrix[i][j].objectType !== findType) {
                if (width + col > worldWidth) {
                    width = worldWidth - col
                }
                else width = xCount;
                break
            }
        }
        xLen = xCount
        xCount = 0
        yCount++
        if ((xCount + col) === worldWidth) {
            xLen = xCount
            yCount++
            xCount = 0
        }
    }
    markChecked(matrix, col, row, xLen, yCount, findType)
    return { objectType: findType, x: col, y: Math.abs(row - height) - 1, width: xLen, height: yCount }

}

function markChecked(matrix, col, row, x, y, type) {

    //console.log(`marking ${x} by ${y} square starting from (${col};${row}) out of ${type}`)
    for (let i = row; i > row - y; i--) {
        for (let j = col; j < x + col; j++) {


            matrix[i][j].checked = true
        }
    }
}





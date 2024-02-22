/**
 * Array of Objects from bitmapReader.js
 * Each object in array will have these attributes:
 * @typedef {Object} bitmapObject
 * @property {string} objectType - Type of the object e.g("platform", "ground", "playerSpawn", ...)
 * @property {number} x - The x-coord of the object in gameworld
 * @property {number} y - The y-coord of the object in gameworld
 * @property {number} width - The width of the object
 * @property {number} height - The height of the object
 */

/**
 * Function that expects an array of objects with the specified attributes to create game world
 * @param {bitmapObject[]} objectArray - Array of objects to add to the game world
 * @param {HTMLElement} gameWorldElem - The element that represents the game world
 */

function generateWorld(objectArray, gameWorldElem) {
    // Contains the gameWorld div height/width (for dynamic purposes)
    const gameWorldDimension = {
        height: gameWorldElem.clientHeight,
        width: gameWorldElem.clientWidth,
    };
    objectArray.forEach(object => {
        gameWorldElem.appendChild(parseObjToDiv(object, gameWorldDimension));
    });
}

// This function turns a single bitmap Obj to a Div ready to be placed in the gameworld
function parseObjToDiv(bitmapObj, gameWorldDimension) {
    const newDivElem = document.createElement('div');
    newDivElem.className = bitmapObj.objectType;
    newDivElem.id = bitmapObj.objectType;
    newDivElem.style.width = bitmapObj.width + 'px';
    newDivElem.style.height = bitmapObj.height + 'px';
    // Color depending on the object Type *TODO
    newDivElem.style.backgroundColor = 'red';

    let leftPos = bitmapObj.x + 'px';
    let topPos = (gameWorldDimension.height - bitmapObj.y) - bitmapObj.height  + 'px';
    newDivElem.style.position = 'absolute';
    newDivElem.style.left = leftPos;
    newDivElem.style.top = topPos;
    return newDivElem;
}

/** @type {bitmapObject[]} */
const bitmapObjects = [];

export { bitmapObjects, generateWorld };
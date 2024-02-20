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
    console.log("i worked!", gameWorldElem, objectArray);
}

/** @type {bitmapObject[]} */
const bitmapObjects = [];

export { bitmapObjects, generateWorld };
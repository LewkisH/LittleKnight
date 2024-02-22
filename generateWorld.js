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

import { CollisionManager, AABBItem } from "./collision.js";

function generateWorld(objectArray, gameWorldElem, colMan) {
    // Contains the gameWorld div height/width (for dynamic purpowses)
    // Bring this in from style, rather than clientHeight/width
    const gameWorldDimension = {
        height: gameWorldElem.clientHeight,
        width: gameWorldElem.clientWidth,
    };
    objectArray.forEach(object => {
        let elem =parseObjToDiv(object, gameWorldDimension)
        gameWorldElem.appendChild(elem);
        let objCol = new AABBItem(elem, object.objectType)
        colMan.addEntity(objCol)
    });
}

// This function turns a single bitmap Obj to a Div ready to be placed in the gameworld
function parseObjToDiv(bitmapObj, gameWorldDimension) {
    const ScaleRatio = 48;
    const newDivElem = document.createElement('div');
    newDivElem.className = bitmapObj.objectType;
    newDivElem.id = bitmapObj.objectType;
    newDivElem.style.width = (bitmapObj.width * ScaleRatio) + 'px';
    newDivElem.style.height = (bitmapObj.height * ScaleRatio) + 'px';
    // Color depending on the object Type *TODO
    switch (bitmapObj.objectType) {
        case "solid":
            newDivElem.style.backgroundColor = 'green';
            break;
        case "platform":
            newDivElem.style.backgroundColor = 'blue';
            break;
        case "hazard":
            newDivElem.style.backgroundColor = 'red';
            break;
        case "collectible":
            newDivElem.style.backgroundColor = 'yellow';
            break;
        case "brown":
            newDivElem.style.backgroundColor = 'brown';
            break;
        case "spawn":
            newDivElem.style.backgroundColor = 'cyan';
            break;
    }

    let leftPos = bitmapObj.x * ScaleRatio + 'px';
    let topPos = (gameWorldDimension.height - (bitmapObj.y * ScaleRatio)) - (bitmapObj.height * ScaleRatio) + 'px';
    newDivElem.style.position = 'absolute';
    newDivElem.style.left = leftPos;
    newDivElem.style.top = topPos;
    return newDivElem;
}

/** @type {bitmapObject[]} */
const bitmapObjects = [];

export { bitmapObjects, generateWorld };
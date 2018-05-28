import { swapValues } from "../number";

/**
 * Generates a random integer number in range (inclusive). From 0 to specified
 * upper number limit.
 * @param max Upper number limit.
 */
function random(max: number) : number
/**
 * Generates a random integer number in range (inclusive) for the specified range.
 * @param min Lower number limit.
 * @param max Upper number limit.
 */
function random(min: number, max: number) : number
function random(min: number, max: number = 0) {
    if(min > max)
        var {a: min, b: max} = swapValues(min, max)
    return Math.floor(Math.random() * (max - min + 1 ) + min)
}


export default random

/**
 * Returns the sum of an array of numbers.
 * @param nums The numbers to be summated.
 */
function sum(nums: number[]) : number
/**
 * Returns the sum of a variable length of numbers.
 * @param nums The numbers to be summated.
 */
function sum(...nums: any[]) : number
function sum(nums: number[]) {
    return nums.reduce((a, b) => a + b, 0)
}


export default sum

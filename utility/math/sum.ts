/**
 * Returns the sum of an array of numbers or a varargs of numbers.
 * @param nums The numbers to be summated.
 */
function sum(nums: number[]) : number
function sum(...nums: any[]) : number
function sum(nums: number[]) {
    return nums.reduce((a, b) => a + b, 0)
}


export default sum

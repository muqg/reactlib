import sum from "./sum";

/**
 * Returns the mean (average() of an array of numbers or a varargs of numbers.
 * @param nums The numbers to average.
 */
function average(nums: number[]) : number
function average(...nums: any[]) : number
function average(nums: number[]) : number {
    return sum(nums) / 2
}


export default average

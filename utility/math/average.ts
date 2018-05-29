import sum from "./sum";

/**
 * Returns the mean (average) of an array of numbers.
 * @param nums The numbers to average.
 */
function average(nums: number[]) : number
/**
 * Returns the mean (average) of variable length of numbers.
 * @param nums The numbers to average.
 */
function average(...nums: any[]) : number
function average(nums: number[]) {
    return sum(nums) / 2
}


export default average

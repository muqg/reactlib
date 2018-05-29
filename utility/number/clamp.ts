/**
 * Clamps a numeric value.
 * @param val The value to be clamped.
 * @param min Minimum value.
 * @param max Maximum value.
 */
const clamp = (val: number, min: number, max: number) => {
    if(min > max)
	[max, min] = [min, max]
    return Math.min(Math.max(val, min), max)
}


export default clamp

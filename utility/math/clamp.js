/**
 * Clamps a numeric value.
 * @param {*} value The value to be clamped.
 * @param {*} min Minimum value.
 * @param {*} max Maximum value.
 */
const clamp = (value = 0, min = 0, max = 0) => {
    if(min > max)
        throw("Minimum value must be less than or equal to the maximum value.")
    return Math.min(Math.max(value, min), max)
}


export default clamp

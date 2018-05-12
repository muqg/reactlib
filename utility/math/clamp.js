const clamp = (value = 0, min = 0, max = 0) => {
    return Math.min(Math.max(value, min), max)
}


export default clamp

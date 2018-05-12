/**
 * Shuffles an array using the Fisher-Yattes algorithm.
 * @param {any} array The array to shuffle.
 */
const shuffle = (array) => {
    // Copy into a new array in order to not affect the other one.
    const newArray = array.slice()

    let currentIndex = newArray.length
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        let temporaryValue = newArray[currentIndex]
        newArray[currentIndex] = newArray[randomIndex]
        newArray[randomIndex] = temporaryValue
    }
    return newArray
}


export default shuffle

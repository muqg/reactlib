/**
 * Shuffles an array using the Fisher-Yattes algorithm.
 * @param arr The array to shuffle.
 */
export function shuffle<T extends any[]>(arr: T): T {
  // Copy into a new array in order to not affect the other one.
  const newArray = arr.slice()

  let currentIndex = newArray.length
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    const temporaryValue = newArray[currentIndex]
    newArray[currentIndex] = newArray[randomIndex]
    newArray[randomIndex] = temporaryValue
  }
  return newArray as T
}

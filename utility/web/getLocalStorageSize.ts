/**
 * Returns the total localStorage size in KB.
 */
function getLocalStorageSize() {
  const content = Object.entries(localStorage).reduce((total, [key, value]) => {
    total += key + value
    return total
  }, "")

  return content ? 3 + (content.length * 16) / (8 * 1024) : 0
}

export {getLocalStorageSize}

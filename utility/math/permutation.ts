function permutation(elements: number) {
  let result = elements--
  while (elements > 1) result *= elements--

  return result
}

export {permutation}

import {permutation} from "./permutation"

function variation(elements: number, pick: number) {
  if (elements < pick) {
    throw "Elements must be equal to or greater than pick"
  }
  if (elements == pick) {
    return elements
  }
  return permutation(elements) / permutation(elements - pick)
}

export {variation}

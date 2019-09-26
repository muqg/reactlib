import {pull} from "../utility/collection"

const initialStateDataObject = (() => {
  const stateElement = document.querySelector("#initial_state")
  return stateElement ? JSON.parse(stateElement.innerHTML) : {}
})()

/**
 * Returns an item from the initial state JSON <meta> object.
 * @param key Key to the state item.
 */
export function initialState<T = any>(key: any): T {
  return pull<T>(initialStateDataObject, key)
}

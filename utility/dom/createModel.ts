import {put} from "../collection"
import {cast} from "../string"
import {ParseableInput} from "./input-parsers"
import {parseElement} from "./parseElement"

export interface CreateModelOptions {
  /**
   * Whether to cast modelled value to its
   * respective primitive or leave it as is.
   */
  cast?: boolean
}

/**
 * Creates a function modelling changes to a nested key of a component's state.
 *
 * @param component The component to model the state of.
 * @param key A nested state model key using "dot notation".
 * @param options Model options.
 */
function createModel(
  component: React.Component,
  key = "",
  options: CreateModelOptions = {},
) {
  options = {
    cast: true,
    ...options,
  }

  return (change: ParseableInput | string, changeVal?: string) => {
    const parsed = parseElement(change, changeVal)

    const name = parsed.name
    const value = options.cast ? cast(parsed.value) : parsed.value

    component.setState(prevState => put(key, {[name]: value}, prevState))

    return {
      name,
      value,
    }
  }
}

export {createModel}

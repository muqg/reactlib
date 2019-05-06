import {SyntheticEvent} from "react"

function isSyntheticEvent(val: any): val is SyntheticEvent {
  // Every truthy value has a constructor name since everything
  // is an object and therefore the line below is unnecessary.
  return val && val.constructor.name === "SyntheticEvent"
  // return isObject(val) && val.constructor.name === "SyntheticEvent"
}

export {isSyntheticEvent}

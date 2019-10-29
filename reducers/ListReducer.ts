import {Action} from "../utility"

type ListReducerElementMatcher<T> =
  | number
  | ((element: T, index: number) => boolean)

export type ListReducerPrependAction<T extends object = any> = Action<
  "prepend",
  T
>
export type ListReducerAppendAction<T extends object = any> = Action<
  "append",
  T
>
export type ListReducerUpdateAction<T extends object = any> = Action<
  "update",
  Partial<T>,
  {where: ListReducerElementMatcher<T>}
>
export type ListReducerRemoveAction<T extends object = any> = Action<
  "remove",
  ListReducerElementMatcher<T>
>

export type ListReducerAction<T extends object = any> =
  | ListReducerPrependAction<T>
  | ListReducerAppendAction<T>
  | ListReducerUpdateAction<T>
  | ListReducerRemoveAction<T>

export type ListReducer<T extends object = any> = (
  list: T[],
  action: ListReducerAction<T>
) => T[]

export function listReducer<T extends object = any>(
  list: T[],
  action: ListReducerAction<T>
) {
  switch (action.type) {
    case "prepend": {
      return [action.value, ...list]
    }
    case "append": {
      return [...list, action.value]
    }
    case "update": {
      const {where, value} = action
      if (typeof where === "function") {
        return list.map((element, index) =>
          where(element, index) ? {...element, ...value} : element
        )
      }

      const nextList = [...list]
      const element = nextList[where]
      nextList[where] = {...element, ...value}
      return nextList
    }
    case "remove": {
      const search = action.value
      const match =
        typeof search === "function"
          ? search
          : (_element: T, index: number) => index === search

      return list.filter((element, index) => !match(element, index))
    }
    default: {
      throw new Error("Invalid action type")
    }
  }
}

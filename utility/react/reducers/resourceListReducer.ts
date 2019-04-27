import {ResourceObject} from "../../../hooks"
import {replace, replaceOrPush, replaceOrPrepend} from "../../array"
import {
    resourceListRemoveAction,
    resourceListSaveAction,
    resourceListSetAction,
    resourceListUpdateAction,
} from "../actions"

export type ResourceListReducerActions =
    | ReturnType<typeof resourceListSaveAction>
    | ReturnType<typeof resourceListUpdateAction>
    | ReturnType<typeof resourceListRemoveAction>
    | ReturnType<typeof resourceListSetAction>

export type ResourceListReducer<T extends ResourceObject = ResourceObject> = (
    list: T[],
    action?: ResourceListReducerActions
) => T[]

/**
 * Designed to be used in combination with the resource list actions.
 */
function resourceListReducer<T extends ResourceObject = ResourceObject>(
    list: T[],
    action?: ResourceListReducerActions
) {
    if (!action) {
        return list
    }

    const actionType = action.type
    switch (action.type) {
        case "save": {
            const resource = action.value
            if (action.options.mode === "prepend") {
                return replaceOrPrepend(
                    list,
                    e => e.id === resource.id,
                    resource
                )
            } else {
                return replaceOrPush(list, e => e.id === resource.id, resource)
            }
        }
        case "update": {
            const current = list.find(e => e.id === action.value.id)
            if (!current) {
                if (__DEV__) {
                    throw "Dispatched an action to update a non-existent list element"
                }
                return list
            }

            const replacement: ResourceObject = {
                ...current,
                ...action.value,
            }
            return replace(list, e => e.id === action.value.id, replacement)
        }
        case "remove": {
            return list.filter(e => e.id !== action.value)
        }
        case "set": {
            return action.value
        }
        default: {
            if (__DEV__) {
                throw `Invalid resource list reducer action '${actionType}'`
            }
            return list
        }
    }
}

export {resourceListReducer}

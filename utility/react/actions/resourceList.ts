import {ResourceObject} from "../../../hooks"
import {createAction} from "../createAction"

/**
 * Action to save an element in the resource list. If the element exists it
 * is updated, otherwise it is appended to the list.
 * @param res The resource element.
 */
export function resourceListSaveAction(res: ResourceObject) {
    return createAction("save", res)
}

/**
 * Action to update an existing element in the resource list.
 */
export function resourceListUpdateAction(
    res: Partial<ResourceObject> & Pick<ResourceObject, "id">
) {
    return createAction("update", res)
}

/**
 * Action to remove an element from the resource list.
 * @param id Id of the element to remove.
 */
export function resourceListRemoveAction(id: ResourceObject["id"]) {
    return createAction("remove", id)
}

/**
 * Action to set a new list.
 * @param list The new list.
 */
export function resourceListSetAction(list: ResourceObject[]) {
    return createAction("set", list)
}

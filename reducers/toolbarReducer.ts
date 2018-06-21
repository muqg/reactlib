import { TOOLBAR_VISIBILITY_CHANGE } from "../actions";

interface ToolbarAction {
    type: string
    payload: boolean
}

function toolbarReducer(state = {}, action: ToolbarAction) {
    switch(action.type) {
        case TOOLBAR_VISIBILITY_CHANGE:
            return {
                ...state,
                lubToolbar: action.payload
            }
        default:
            return state
    }
}

export { toolbarReducer }

import { TOOLBAR_VISIBILITY_CHANGE } from "./const";

function setToolbarVisibility(isVisible: boolean) {
    return {
        type: TOOLBAR_VISIBILITY_CHANGE, payload: isVisible
    }
}

export { setToolbarVisibility }

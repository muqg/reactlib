import { NOTIFICATION_CHANGE } from "../actions";

interface NotificationAction {
    type: string
    payload: string
}

function notificationReducer(state = {}, action: NotificationAction) {
    switch(action.type) {
        case NOTIFICATION_CHANGE:
            return action.payload
        default:
            return state
    }
}

export { notificationReducer };

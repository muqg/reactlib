import { NOTIFICATION_CHANGE } from "./const";

function setNotification(content: string) {
    return {
        type: NOTIFICATION_CHANGE, payload: content
    }
}

export { setNotification };

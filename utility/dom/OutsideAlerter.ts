import { isNumber } from "../assertions";

class OutsideAlerter {
    private currentId = 0
    private containers: {
        [key: number]: {
            element: HTMLElement,
            callback: () => void
        }
    }

    constructor() {
        document.addEventListener("mouseup", this.handleClick.bind(this))

        this.containers = {}
    }

    private handleClick(event: React.MouseEvent<any>) {
        const target = event.target as HTMLElement
        for(let id in this.containers) {
            const currentContainer = this.containers[id]

            if(!currentContainer.element.contains(target))
                currentContainer.callback()
        }
    }

    /**
     * Adds a container element whose callback will be called when a click
     * happens outside of it.
     * @param container The container element.
     * @param callback The alerting callback.
     */
    addContainer(container: HTMLElement, callback: () => void) {
        let id: number | string | undefined = container.dataset.outsideAlerterId

        if(!isNumber(id))
            id = this.currentId++

        this.containers[id] = {
            element: container,
            callback
        }
    }

    /**
     * Removes a container element from the notification list.
     * @param container The container to be removed.
     * @returns True if element was removed, false otherwise.
     */
    removeContainer(container: HTMLElement): boolean {
        const id = container.dataset.outsideAlerterId
        if(isNumber(id)) {
            delete this.containers[id]
            return true
        }
        return false
    }
}


/**
 * Alerts (via callback) when a click occurs outside of a container element.
 */
const alerter = new OutsideAlerter()
export default alerter

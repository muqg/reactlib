
interface Container extends HTMLElement {
    __outsideContainerId: number
}

class OutsideAlerter {
    private currentId = 0
    private containers: {
        [key: number]: {
            element: Container,
            callback: () => void
        }
    }

    constructor() {
        document.addEventListener("mouseup", this.handleClick.bind(this))

        this.containers = {}
    }

    private handleClick(event: React.MouseEvent<any>) {
        const target = event.target
        for(let id in this.containers) {
            const currentContainer = this.containers[id]

            if(!currentContainer.element.contains(target as HTMLElement))
                currentContainer.callback()
        }
    }

    /**
     * Adds a container element whose callback will be called when a click
     * happens outside of it.
     * @param container The container element.
     * @param callback The alerting callback.
     */
    addContainer(container: Container, callback: () => void) {
        const id = container.__outsideContainerId || this.currentId++
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
    removeContainer(container: Container): boolean {
        const id = container.__outsideContainerId
        if(id) {
            delete this.containers[id]
            return true
        }
        return false
    }
}


export default new OutsideAlerter()

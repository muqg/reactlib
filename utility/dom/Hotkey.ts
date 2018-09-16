import { clean } from "../collection";

export class Hotkey {
    /**
     * Code value of the key.
     */
    code? = ""
    /**
     * Key value of the key.
     */
    eventKey? = ""
    /**
     * KeyCode value of the key.
     */
    keyCode? = 0
    /**
     * Whether alt modifier key is presssed.
     */
    alt? = false
    /**
     * Whether ctrl modifier key is presssed.
     */
    ctrl? = false
    /**
     * Whether system's meta modifier key is presssed.
     */
    meta? = false
    /**
     * Whether shift modifier key is presssed.
     */
    shift? = false

    constructor(data?: Hotkey) {
        if(data) {
            Object.assign(this, clean(data))
        }
    }
}

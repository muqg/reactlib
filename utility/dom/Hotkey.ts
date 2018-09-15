export interface HotkeyModifiers {
    /**
     * Wheter alt key is presssed.
     */
    alt?: boolean
    /**
     * Wheter ctrl key is presssed.
     */
    ctrl?: boolean
    /**
     * Wheter system's meta key is presssed.
     */
    meta?: boolean
    /**
     * Wheter shift key is presssed.
     */
    shift?: boolean
}

export class Hotkey implements HotkeyModifiers {
    readonly code: number
    readonly alt = false
    readonly ctrl = false
    readonly meta = false
    readonly shift = false

    constructor(code: number, mod?: HotkeyModifiers) {
        this.code = code
        Object.assign(this, mod)
    }
}

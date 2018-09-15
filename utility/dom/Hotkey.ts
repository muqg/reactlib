export interface HotkeyModifiers {
    /**
     * Whether alt key is presssed.
     */
    alt?: boolean
    /**
     * Whether ctrl key is presssed.
     */
    ctrl?: boolean
    /**
     * Whether system's meta key is presssed.
     */
    meta?: boolean
    /**
     * Whether shift key is presssed.
     */
    shift?: boolean
}

export interface HotkeyKey {
    /**
     * Code value of the key.
     */
    code?: string
    /**
     * Key value of the key.
     */
    key?: string
    /**
     * KeyCode value of the key.
     */
    keyCode?: number
}

export class Hotkey implements HotkeyModifiers, HotkeyKey {
    code    = ""
    key     = ""
    keyCode = 0
    alt     = false
    ctrl    = false
    meta    = false
    shift   = false

    constructor(key?: HotkeyKey, mods?: HotkeyModifiers) {
        Object.assign(this, key, mods)
    }
}

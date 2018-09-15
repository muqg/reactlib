interface Modifiers {
    alt?: boolean
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
}

class Hotkey {
    readonly code: number
    readonly alt = false
    readonly ctrl = false
    readonly meta = false
    readonly shift = false

    constructor(code: number, mod?: Modifiers) {
        this.code = code
        Object.assign(this, mod)
    }
}

export { Hotkey }

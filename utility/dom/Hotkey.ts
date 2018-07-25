interface Modifiers {
    alt: boolean
    ctrl: boolean
    shift: boolean
}

class Hotkey {
    readonly code: number
    readonly alt: boolean
    readonly ctrl: boolean
    readonly shift: boolean

    constructor(code: number, mod?: Modifiers) {
        this.code = code
        this.alt = (mod && mod.alt) || false
        this.ctrl = (mod && mod.ctrl) || false
        this.shift = (mod && mod.shift) || false
    }
}

export { Hotkey }

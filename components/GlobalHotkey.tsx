import * as React from "react"
import { Hotkey, isKeyPressed } from "../utility/dom";
import { HotkeyModifiers } from "../utility/dom/Hotkey";


interface Props {
    children?: any

    /**
     * The target key's character code.
     */
    code: number
    /**
     * Handler for when the key is pressed.
     */
    onPress: (event: KeyboardEvent) => void

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


class GlobalHotkey extends React.Component<Props> {
    componentDidMount() {
        window.addEventListener("keydown", this.handle)
    }

    componentWillUnmount() {
        window.addEventListener("keydown", this.handle)
    }

    handle = (event: KeyboardEvent) => {
        const hotkey = new Hotkey(
            this.props.code,
            (({alt, ctrl, meta, shift}: HotkeyModifiers) => ({alt, ctrl, meta, shift}))(this.props)
        )

        if(isKeyPressed(hotkey, event))
            this.props.onPress(event)
    }

    render() {
        if(this.props.children)
            return this.props.children
        return null
    }
}


export { GlobalHotkey }

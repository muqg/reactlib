import * as React from "react";
import { Hotkey, isKeyPressed } from "../utility/dom";
import { HotkeyModifiers, HotkeyKey } from "../utility/dom/Hotkey";


interface OwnProps {
    children?: any

    /**
     * Handler for when the key is pressed.
     */
    handler: (event: KeyboardEvent) => void
}

type Props = OwnProps & HotkeyModifiers & HotkeyKey


class GlobalHotkey extends React.Component<Props> {
    componentDidMount() {
        window.addEventListener("keydown", this.handle)
    }

    componentWillUnmount() {
        window.addEventListener("keydown", this.handle)
    }

    handle = (event: KeyboardEvent) => {
        const hotkey = new Hotkey(
            (({code, eventKey, keyCode}: HotkeyKey) => ({code, eventKey, keyCode}))(this.props),
            (({alt, ctrl, meta, shift}: HotkeyModifiers) => ({alt, ctrl, meta, shift}))(this.props)
        )

        if(isKeyPressed(hotkey, event))
            this.props.handler(event)
    }

    render() {
        if(this.props.children)
            return this.props.children
        return null
    }
}


export { GlobalHotkey };


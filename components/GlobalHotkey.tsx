import * as React from "react";
import { Hotkey, isKeyPressed } from "../utility/dom";


interface OwnProps {
    /**
     * Whether to allow hotkey inside input elements.
     */
    allowInsideInputs?: boolean

    children?: any

    /**
     * Handler for when the key is pressed.
     */
    handler: (event?: KeyboardEvent) => void
}

type Props = OwnProps & Hotkey


class GlobalHotkey extends React.Component<Props> {
    componentDidMount() {
        window.addEventListener("keydown", this.handle)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handle)
    }

    handle = (event: KeyboardEvent) => {
        const hotkey = new Hotkey(
            (({code, eventKey, keyCode, alt, ctrl, meta, shift}: Hotkey) =>
                    ({code, eventKey, keyCode, alt, ctrl, meta, shift})
            )(this.props),
        )

        if(isKeyPressed(hotkey, event, this.props.allowInsideInputs))
            this.props.handler(event)
    }

    render() {
        return this.props.children || null
    }
}


export { GlobalHotkey };


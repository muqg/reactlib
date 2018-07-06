import * as React from "react";
import "../css/close_button.css";
import { classNames } from "../utility/dom";

interface Props {
    className?: string
    onClick: (e: React.MouseEvent<any>) => void
    /**
     * Close button's size in pixels. This accounts for both width and height.
     */
    size?: number
}

function CloseButton(props: Props) {
    let style = {}
    if(props.size) {
        const size = props.size + "px";
        style = {
            height: size,
            width: size
        }
    }

    return (
        <button
            className={classNames("l_close", props.className)}
            onClick={props.onClick}
            type="button"
            style={style}
        >
            <span></span>
        </button>
    )
}

export default CloseButton

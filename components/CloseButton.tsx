import * as React from "react";
import "../css/close_button.css";
import { classNames } from "../utility/dom";

interface Props {
    className?: string
    attributes?: object
    onClick: (e: React.MouseEvent<any>) => void
}

function CloseButton(props: Props) {
    return (
        <button
            className={classNames("l_close", props.className)}
            onClick={props.onClick}
            type="button"
            {...props.attributes}
        >
            <span></span>
        </button>
    )
}

export default CloseButton

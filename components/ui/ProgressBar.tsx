import * as React from "react";
import "../../css/ui/progress_bar.css";
import { classNames } from "../../utility/dom";

/**
 * @param {any} props
 *  -> percent: int | The progress percent.
 *  -> className: string | Additional classes as a string.
 *  -> attributes: object | Additional attributes.
 */
function ProgressBar({percent = 0, className = "", attributes = {}}) {
    // TODO: React | Remove or rework.
    console.log("[DEPRECATED] ProgressBar is deprecated. A new replacement will be dropped in.... eventually.")
    percent = Math.min(Math.max(percent, 0), 100)

    const style = {
        left: (percent - 100) + "%",
    }

    return (
        <div
            className={classNames(".l_gui_progressbar", className)}
            {...attributes}
        >
            <span style={style}></span>
            <p><span>{percent}</span>%</p>
        </div>
    )
}

export default ProgressBar
import * as React from "react"
import {ClassName} from "./init"
import "../../css/ui/progress_bar.css"

/**
 * @param {any} props
 *  -> percent: int | The progress percent.
 *  -> classList: string | Additional classes as a string.
 *  -> attributes: object | Additional attributes.
 */
function ProgressBar({percent = 0, classList = "", attributes}) {
    percent = Math.min(Math.max(percent, 0), 100)

    const style = {
        left: (percent - 100) + "%",
    }

    return (
        <div
            className={[ClassName.ProgressBar, classList].join(" ")}
            {...attributes}
        >
            <span style={style}></span>
            <p><span>{percent}</span>%</p>
        </div>
    )
}

export default ProgressBar
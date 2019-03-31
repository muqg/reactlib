import {rgbColor} from "../utility/dom"

function fadedColor(hexColor: string, rate: 0.12 | 0.5 = 0.12) {
    const c = rgbColor(hexColor)
    return `rgba(${c.red},${c.green},${c.blue},${rate})`
}

export {fadedColor}

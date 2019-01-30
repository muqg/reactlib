import { rgbColor } from "../utility/dom";

function fadedColor(hexColor: string, rate: .12 | .5 = .12) {
    const c = rgbColor(hexColor)
    return `rgba(${c.red},${c.green},${c.blue},${rate})`
}

export { fadedColor };


import { rgbColor } from "../utility/dom";

function fadedColor(hexColor: string) {
    const c = rgbColor(hexColor)
    return `rgba(${c.red},${c.green},${c.blue},.12)`
}

export { fadedColor };


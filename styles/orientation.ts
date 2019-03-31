import {css} from "."
import {Dict} from "../utility"

interface Orientation extends Dict<any> {
    landscape: typeof css
    portrait: typeof css
}

const orientations = ["portrait", "landscape"]

const orientation = {} as Orientation

for (let o of orientations) {
    orientation[o] = (...args: any[]) => {
        const [first, ...rest] = args
        return css`
            @media (orientation: o) {
                ${css(first, ...rest)}
            }
        `
    }
}

export {orientation}

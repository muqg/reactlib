import { Dict } from "../utility";
import { css } from "./styled-components";

interface Media extends Dict<any> {
    desktop: typeof css
    laptop: typeof css
    tablet: typeof css
    smallTablet: typeof css
    mobile: typeof css
    smallMobile: typeof css
}

const widths: Dict<number> = {
    desktop: 1281,
    laptop: 1025,
    tablet: 961,
    smallTablet: 641,
    mobile: 481,
    smallMobile: 321
}

const media = {} as Media

Object.entries(widths).forEach(([key, value]) => {
    media[key] = (...args: any[]) => {
        const [first, ...rest] = args
        return css`
            @media (max-width: ${value / 16}em) {
                ${css(first, ...rest)}
            }
        `
    }
})

export { media };

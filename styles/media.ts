import {Dict} from "../utility"
import {css} from "./styled-components"

interface Media extends Dict<any> {
  /**
   * Width of no more than 1281px.
   */
  desktop: typeof css
  /**
   * Width of no more than 1025px.
   */
  laptop: typeof css
  /**
   * Width of no more than 961px.
   */
  tablet: typeof css
  /**
   * Width of no more than 641px.
   */
  smallTablet: typeof css
  /**
   * Width of no more than 481px.
   */
  mobile: typeof css
  /**
   * Width of no more than 321px.
   */
  smallMobile: typeof css
}

const widths: Dict<number> = {
  desktop: 1281,
  laptop: 1025,
  tablet: 961,
  smallTablet: 641,
  mobile: 481,
  smallMobile: 321,
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

export {media}

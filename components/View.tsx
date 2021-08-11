import {css, styled} from "../styles"
import {Size} from "../utility"
import {isNumber} from "../utility/assertions"

const VIEW_WIDTH_SIZE_MODIFIER = 320

interface StyleProps {
  /**
   * Fills the height of the parent container. Also makes
   * its overflow content scrollable instead of visible.
   */
  fullHeight?: boolean
  /**
   * Fills the width of the parent container. Enabled by default.
   */
  fullWidth?: boolean
  /**
   * Height size as a valid CSS property. It is disregarded
   * if `fullHeight` property is present. It also makes
   * overflow content scrollable instead of visible.
   */
  height?: string
  /**
   * Width size, based on the default standard modifier.
   * It is disregarded if `fullWidth` property is present,
   */
  width?: Size
}

export const View = styled.div`
  display: block;
  max-width: ${(p) =>
    !p.fullWidth && isNumber(p.width)
      ? p.width * VIEW_WIDTH_SIZE_MODIFIER + "px"
      : "100%"};
  position: relative;
  width: 100%;

  ${(p: StyleProps) =>
    (p.height || p.fullHeight) &&
    css`
      height: 100%;
      max-height: ${(p: StyleProps) =>
        !p.fullHeight && p.height ? p.height : "100%"};
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    `}
`

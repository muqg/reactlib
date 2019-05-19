import {css, media, styled} from "../styles"
import {View} from "./View"

type AlignmentProperty = "nomral" | "center"

interface StyleProps {
  /**
   * A device media type to break a grid row for. If the current device is below
   * the media width of the given breakpoint device, then the grid row will be
   * broken so that each of its children takes up a row on its own.
   *
   * _Only works for `row` direction grids. Otherwise it is ignored._
   */
  breakpoint?: keyof typeof media
  /**
   * The direction in which the grid will grow. If `wrap` is enabled,
   * then once a row or column is filled, it grows a new one. Row by default.
   */
  direction?: "row" | "column"
  horizontalAlign?: AlignmentProperty
  verticalAlign?: AlignmentProperty
  /**
   * Whether the grid should grow indefinetily in its given
   * direction or grow a new row or column when one is filled.
   */
  wrap?: boolean
}

const columnStyle = css`
  align-items: ${(p: StyleProps) => align(p.horizontalAlign)};
  flex-direction: column;
  justify-content: ${(p: StyleProps) => justify(p.verticalAlign)};
`
const rowStyle = css`
  align-items: ${(p: StyleProps) => align(p.verticalAlign)};
  flex-direction: row;
  justify-content: ${(p: StyleProps) => justify(p.horizontalAlign)};
  ${(p: StyleProps) =>
    p.breakpoint &&
    media[p.breakpoint]`
      flex-direction: column;
    `}
`

export const Grid = styled(View)`
  display: flex;
  ${p => p.wrap && `flex-wrap: wrap;`}
  ${(p: StyleProps) => (p.direction === "column" ? columnStyle : rowStyle)}
`

function align(type: StyleProps["verticalAlign"]) {
  switch (type) {
    case "center":
      return "center"
    default:
      return "normal"
  }
}

function justify(type: StyleProps["horizontalAlign"]) {
  switch (type) {
    case "center":
      return "center"
    default:
      return "normal"
  }
}

import {css, media, styled} from "../styles"
import {View} from "./View"

interface StyleProps {
  /**
   * Alignment of grid's children
   *  - For `row` direction it refers to vertical alignment
   *  - For `column` direction it refers to horizontal alignment
   */
  align?: "stretch" | "center"
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
  /**
   * Justification of grid's children
   *  - For `row` direction it refers to horizontal alignment
   *  - For `column` direction it refers to vertical alignment
   */
  justify?: "normal" | "center"
  /**
   * Whether the grid should grow indefinetily in its given
   * direction or grow a new row or column when one is filled.
   */
  wrap?: boolean
}

const columnStyle = css`
  flex-direction: column;
`
const rowStyle = css`
  flex-direction: row;
  ${(p: StyleProps) =>
    p.breakpoint &&
    media[p.breakpoint]`
      align-items: flex-start;
      flex-direction: column;
    `}
`

export const Grid = styled(View)`
  align-items: ${p => p.align};
  display: flex;
  ${p => p.wrap && `flex-wrap: wrap;`}
  justify-content: ${p => p.justify};

  ${(p: StyleProps) => (p.direction === "column" ? columnStyle : rowStyle)}
`

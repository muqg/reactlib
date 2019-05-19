import {css, styled, fadedColor, COLOR_DARK} from "../styles"
import {Size} from "../utility"
import {View} from "./View"

const FONT_SIZE_FACTOR = 0.5

interface StyleProps {
  center?: boolean
  size?: Size
  underline?: boolean
}

const Heading = styled(View.withComponent("h1"))`
  font-size: ${(p: StyleProps) => 0.5 + p.size! * FONT_SIZE_FACTOR}em;
  margin: 0 0 ${(p: StyleProps) => 15 + p.size!}px;
  padding-bottom: 6px;

  ${p =>
    p.center &&
    css`
      margin-left: auto;
      margin-right: auto
      text-align: center;
    `}
  ${p =>
    p.underline &&
    css`
      border-bottom: 1px solid ${p => fadedColor(p.theme.main || COLOR_DARK)};
    `}
`
Heading.defaultProps = {
  size: Size.Large,
}
Heading.displayName = "Heading"

export {Heading}

import {css, styled, fadedColor, COLOR_DARK} from "../styles"
import {Size} from "../utility"

const FONT_SIZE_FACTOR = 0.5

interface StyleProps {
    center?: boolean
    size?: Size
    underline?: boolean
}

const Heading = styled.h1`
    ${(_: StyleProps) => ""}

    display: block;
    font-size: ${p => 0.5 + p.size! * FONT_SIZE_FACTOR}em;
    margin-bottom: ${p => 15 + p.size!}px;
    padding-bottom: 6px;
    width: 100%;

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
            border-bottom: 1px solid
                ${p => fadedColor(p.theme.main || COLOR_DARK)};
        `}
`
Heading.defaultProps = {
    size: Size.Large,
}
Heading.displayName = "Heading"

export {Heading}

import {COLOR_DARK, styled} from "../styles"
import {Size} from "../utility"

const SIZE_FACTOR = 12

interface StyleProps {
    size?: Size
}

const Divider = styled.div`
    ${(_p: StyleProps) => ""}

    background: ${p => p.theme.main || COLOR_DARK};
    height: 1px;
    margin: ${p => p.size! * SIZE_FACTOR}px 0;
    padding: 0 !important;
    width: 100%;
`
Divider.defaultProps = {
    size: Size.Slim,
}
Divider.displayName = "Divider"

export {Divider}

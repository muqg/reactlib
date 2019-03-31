import * as React from "react"
import {css, styled} from "../styles"
import {Size} from "../utility"

const MARGIN_SIZE_FACTOR = 12
const WIDTH_SIZE_FACTOR = 320

const center = css`
    ${(_p: StyleProps) => ""}

    align-items: center;
    display: flex;
    flex-direction: column;
    margin: ${p => p.margin! * MARGIN_SIZE_FACTOR}px auto;
`
const Container = styled.div`
    ${(_p: StyleProps) => ""}

    margin: ${p => p.margin! * MARGIN_SIZE_FACTOR}px 0;
    max-width: inherit;
    position: relative;

    ${p => p.center && center}
    ${p =>
        p.width &&
        css`
            max-width: ${p.width * WIDTH_SIZE_FACTOR}px;
            width: 100%;
        `}
`
Container.defaultProps = {
    margin: Size.Small,
}

const Title = styled.h4`
    padding: 4px 0;
`

interface StyleProps {
    /**
     * Attempts to center the content.
     */
    center?: boolean
    margin?: Size
    /**
     * Maximum width of the block.
     */
    width?: Size
}

type Props = React.ComponentProps<typeof Container>

const Block = ({children, title, ...props}: Props) => {
    return (
        <Container {...props}>
            {title && <Title>{title}</Title>}
            {children}
        </Container>
    )
}

export {Block}

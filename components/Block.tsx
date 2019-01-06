import * as React from "react";
import { styled, css } from "../styles";
import { Omit } from "../utility";

const center = css`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 12px auto;
`
const Container = styled.div`
    ${(_p: StyleProps) => ""}

    box-sizing: border-box;
    margin: 12px 0;
    max-width: inherit;
    position: relative;

    ${p => p.center && center}
    ${p => p.maxWidth && css`
        max-width: ${p.maxWidth}px;
        width: 100%;
    `}
`
const Title = styled.h4`
    padding: 4px 0;
`

interface StyleProps {
    /**
     * Attempts to center the content.
     */
    center?: boolean
    /**
     * Maximum width of the block.
     */
    maxWidth?: number
}

// Ref is not assignable to SC 4.0.3
type Block = Omit<React.HTMLProps<HTMLDivElement>, "ref" | "as"> & StyleProps


const Block = ({children, title, ...props}: Block) => {
    return (
        <Container {...props}>
            {title && <Title>{title}</Title>}
            {children}
        </Container>
    )
}


export { Block };


import * as React from "react";
import { styled, css } from "../styles";
import { Omit } from "../utility";


const Container = styled.div`
    ${(_p: StyleProps) => ""}

    margin: 12px 0;
    min-width: 285px;
    width: 100%;

    ${p => p.center && css`margin: 12px auto;`}
    ${p => p.maxWidth && css`max-width: ${p.maxWidth}px;`}
`
const Title = styled.h4`
    padding: 4px 0;
`

interface StyleProps {
    /**
     * Attempts to center the block.
     * Use in combination with maxWidth prop.
     */
    center?: boolean
    /**
     * Maximum width of the block.
     */
    maxWidth?: number
}

// Ref is not assignable to SC 4.0.3
type Block = Omit<React.HTMLProps<HTMLDivElement>, "ref"> & StyleProps


const Block = ({children, title, ...props}: Block) => {
    return (
        <Container {...props}>
            {title && <Title>{title}</Title>}
            {children}
        </Container>
    )
}


export { Block };


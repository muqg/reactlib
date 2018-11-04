import * as React from "react"
import styled from "styled-components";
import { Translate } from ".";


const Container = styled.div`
    display: block;
    margin: 12px 0;

    > textarea {
        min-height: 4em;
        width: 100%;
    }
`
const Title = styled.h4`
    padding: 4px 0;
`

interface Props {
    as?: string
    children?: any
    className?: string
    title?: string
    /**
     * Whether the title is a key to a translation text.
     */
    translate?: boolean
}


const Block = ({as, children, className, title, translate}: Props) => {
    return (
        <Translate value={title || ""}>
            {text => (
                <Container className={className} as={as}>
                    <Title>
                        {translate ? text : title}
                    </Title>
                    {children}
                </Container>
            )}
        </Translate>
    )
}


export { Block }

import * as React from "react";
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


interface Props extends ContainerProps {
    /**
     * Whether the title is a key to a translation text.
     */
    translate?: boolean
}
interface ContainerProps {
    as?: string
    children?: any
    className?: string
    title?: string
}


const Block = ({translate, ...props}: Props) => {
    if(translate && props.title) {
        return (
            <Translate value={props.title}>
                {text => <BlockContent {...props} title={text} />}
            </Translate>
        )
    }
    return <BlockContent {...props} />
}

const BlockContent = ({as, className, title, children}: ContainerProps) => {
    return (
        <Container className={className} as={as}>
            <Title>
                {title}
            </Title>
            {children}
        </Container>
    )
}


export { Block };

import * as React from "react";
import { useTranslation } from "../hooks";
import { styled } from "../styles";


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
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    children?: any
    className?: string
    title?: string
}


const Block = ({translate, as, className, title = "", children}: Props) => {
    const getTranslated = useTranslation()

    return (
        <Container className={className} as={as}>
            <Title>
                {translate ? getTranslated(title) : title}
            </Title>
            {children}
        </Container>
    )
}


export { Block };

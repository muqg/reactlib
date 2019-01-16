import * as React from "react";
import { COLOR_BACKGROUND, COLOR_DARK, styled, css } from "../../styles";
import { truncate } from "../../styles/mixins";
import { Size } from "../../utility";
import { CloseButton } from "../buttons";
import { Dialog, DialogProps } from "./Dialog";

const SIZE_FACTOR = 320

const Back = styled.div`
    background: black;
    bottom: 0;
    left: 0;
    opacity: .75;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
`
const Header = styled.div`
    align-items: center;
    display: flex;
    padding: 3px 0;

    ${(p: {underline: boolean}) => p.underline && css`
        border-bottom: 1px solid;
        border-image: linear-gradient(to right, transparent, ${COLOR_DARK}, transparent) 1;
        margin-bottom: 18px;
    `}
`
const Title = styled.p`
    font-size: 1.1rem;
    ${truncate("100%")}
`
const Container = styled.div`
    ${(_p: ContainerStyleProps) => ""}

    background: ${COLOR_BACKGROUND};
    display: flex;
    flex-direction: column;
    max-width: ${p => p.size * SIZE_FACTOR}px;
    padding: 0 12px 12px;
    width: 100%;

    ${p => p.fixedHeight ? css`height: 90vh;` : css`max-height: 90vh;`}
`
const Content = styled.div`
    overflow: auto;
`

interface ContainerStyleProps {
    /**
     * Whether height should adjust based on content or
     * always be at its maximum.
     */
    fixedHeight?: boolean
    size: Size
}

export interface DialogBoxProps extends Partial<ContainerStyleProps> {
    children: Dialog["children"]
    /**
     * Dialog's title.
     */
    title?: string
}

type Props = DialogBoxProps & DialogProps

const DialogBox: React.ComponentType<Props> = ({className, fixedHeight, size = Size.Small, ...props}) => {
    return (
        <Dialog {...props}>
            {close =>
                <>
                    <Back onClick={close} />
                    <Container className={className} fixedHeight={fixedHeight} size={size}>
                        <Header underline={!!props.title}>
                            <Title>
                                {props.title}
                            </Title>
                            <CloseButton onClick={close} />
                        </Header>
                        <Content>
                            {props.children(close)}
                        </Content>
                    </Container>
                </>
            }
        </Dialog>
    )
}


export { DialogBox };


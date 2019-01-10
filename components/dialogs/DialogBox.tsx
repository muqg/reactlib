import * as React from "react";
import { CloseButton } from "..";
import { COLOR_BACKGROUND, COLOR_DARK, styled } from "../../styles";
import { truncate } from "../../styles/mixins";
import { Size } from "../../utility";
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
    border-bottom: 1px solid;
    border-image: linear-gradient(to right, transparent, ${COLOR_DARK}, transparent) 1;
    display: flex;
    margin-bottom: 24px;
`
const Title = styled.p`
    font-size: 1.1rem;
    ${truncate("100%")}
`
const StyledCloseButton = styled(CloseButton)`
    position: initial;
    top: 0;
    left: 0;
`
const Container = styled.div`
    ${(_p: ContainerStyleProps) => ""}

    background: ${COLOR_BACKGROUND};
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    max-width: ${p => p.size * SIZE_FACTOR}px;
    padding: 6px 12px 12px;
    position: relative;
    width: 100%;
`
const Content = styled.div`
    overflow: auto;
`

interface ContainerStyleProps {
    size: Size
}

export interface DialogBoxProps {
    children: Dialog["children"]
    size?: Size
    /**
     * Dialog's title.
     */
    title?: string
}

type Props = DialogBoxProps & DialogProps

const DialogBox: React.ComponentType<Props> = ({size = Size.Small, className, ...props}) => {
    return (
        <Dialog {...props}>
            {close =>
                <>
                    <Back onClick={close} />
                    <Container size={size} className={className}>
                        <Header>
                            <Title>
                                {props.title}
                            </Title>
                            <StyledCloseButton onClick={close} />
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


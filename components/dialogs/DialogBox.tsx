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
const Container = styled.div`
    ${(_p: ContainerStyleProps) => ""}

    background: ${COLOR_BACKGROUND};
    max-height: 90vh;
    max-width: ${p => p.size * SIZE_FACTOR}px;
    padding: 12px;
    position: relative;
    width: 100%;
`
const Title = styled.p`
    &:not(:empty) {
        border-bottom: 1px solid;
        border-image: linear-gradient(to right, transparent, ${COLOR_DARK}, transparent) 1;
        font-weight: bold;
        margin-bottom: 27px;
        padding-bottom: 3px;
        ${truncate("85%")}
    }
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
                        <CloseButton onClick={close} />
                        <div>
                            <Title>
                                {props.title}
                            </Title>
                            {props.children(close)}
                        </div>
                    </Container>
                </>
            }
        </Dialog>
    )
}


export { DialogBox };


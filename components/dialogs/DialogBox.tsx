import * as React from "react";
import { CloseButton } from "..";
import { COLOR_BACKGROUND, COLOR_DARK, styled } from "../../styles";
import { Dialog, DialogProps } from "./Dialog";


const Back = styled.div`
    background: black;
    height: 100%;
    left: 0;
    opacity: .5;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
`
const Container = styled.div`
    background: ${COLOR_BACKGROUND};
    border-radius: 3px;
    min-height: 54px;
    max-height: 400px;
    padding: 12px;
    position: relative;
    width: 300px;
`
const Title = styled.p`
    &:not(:empty) {
        border-bottom: 1px solid;
        border-image: linear-gradient(to right, ${COLOR_DARK}, ${COLOR_DARK}, ${COLOR_BACKGROUND}) 1;
        font-weight: bold;
        margin-bottom: 27px;
        overflow: hidden;
        padding-bottom: 3px;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 85%;
    }
`

export interface DialogBoxProps {
    children?: Dialog["children"]
    /**
     * Dialog's title.
     */
    title?: string
}

const DialogBox = (props: DialogBoxProps & DialogProps) => {
    return(
        <Dialog {...props}>
            {close =>
                <>
                    <Back onClick={close} />
                    <Container>
                        <CloseButton onClick={close} />
                        <div>
                            <Title>
                                {props.title}
                            </Title>
                            {props.children && props.children(close)}
                        </div>
                    </Container>
                </>
            }
        </Dialog>
    )
}





export { DialogBox };


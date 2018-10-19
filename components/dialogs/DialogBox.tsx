import * as React from "react";
import { CloseButton } from "..";
import { COLOR_BLACK, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, COLOR_SECONDARY_LIGHT, styled } from "../../styles";
import { Dialog, DialogProps } from "./Dialog";


const Back = styled.div`
    background: ${COLOR_BLACK};
    height: 100%;
    left: 0;
    opacity: .5;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
`
const Container = styled.div`
    background: ${COLOR_SECONDARY_LIGHT};
    border-radius: 3px;
    box-sizing: border-box;
    min-height: 54px;
    max-height: 400px;
    padding: 12px;
    position: relative;
    width: 300px;
`
const Title = styled.p`
    &:not(:empty) {
        border-bottom: 1px solid;
        border-image: linear-gradient(to right, ${COLOR_PRIMARY_DARK}, ${COLOR_PRIMARY_LIGHT}) 1;
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
    children?: Dialog["props"]["children"]
    /**
     * Dialog's title.
     */
    title?: string
}

const DialogBox = (props: DialogBoxProps & DialogProps) => {
    return(
        <Dialog {...props}>
            {(close, show) =>
                <>
                    <Back onClick={close} />
                    <Container>
                        <CloseButton onClick={close} size={22} />
                        <div>
                            <Title>
                                {props.title}
                            </Title>
                            {props.children && props.children(close, show)}
                        </div>
                    </Container>
                </>
            }
        </Dialog>
    )
}





export { DialogBox };


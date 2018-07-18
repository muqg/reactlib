import * as React from "react";
import { CloseButton } from "..";
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, css, styled, COLOR_SECONDARY_LIGHT, COLOR_BLACK } from "../../styles";
import { wait } from "../../utility";
import { CHAR_CODE_ESCAPE } from "../../utility/dom";


const visibleStyle = css`
    opacity: 1;
    visibility: visible;
`
const Wrapper = styled.div`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: fixed;
    top: 0;
    transition: .25s;
    transition-property: opacity, visibility;
    visibility: hidden;
    width: 100%;
    z-index: 100;

    ${(p: StyleProps) => p.visible && visibleStyle}
`
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


export type DialogProps = Props & StyleProps

interface StyleProps {
    visible?: boolean
}

interface Props {
    children?: any
    /**
     * Class names for the dialog .l_dialog element.
     */
    className?: string
    /**
     * Whether dialog is visible or not.
     */
    visible?: boolean
    /**
     * Dialog's title.
     */
    title?: string
    /**
     * Called when a key press down occurs on the focused dialog.
     */
    onKeyDown?: (dialogElement: HTMLDivElement, event: React.KeyboardEvent) => void
    /**
     * Called when dialog is closed (hidden from visibility).
     */
    onClose?: (event: React.SyntheticEvent<any>) => void
    /**
     * Called when dialog is opened (becomes visible).
     */
    onShow?: (dialogElement: HTMLDivElement) => void
}

interface State {
    isVisible: boolean
}


class Dialog extends React.Component<Props, State> {
    state = {
        isVisible: this.props.visible || false
    }
    dialogElement = React.createRef<HTMLDivElement>()

    async componentDidUpdate(prevProps: Props, prevState: State) {
        if(this.props.visible !== prevProps.visible) {
            this.setState({isVisible: this.props.visible || false})
        }

        if(this.state.isVisible && !prevState.isVisible) {
            const dialog = this.dialogElement.current

            // Wait before calling open callback since dom interactions don't
            // always work correctly if children are not yet rendered or updated.
            await wait(30)
            if(dialog) {
                dialog.focus()

                if(this.props.onShow)
                    this.props.onShow(dialog)
            }
        }
    }

    close = (event: React.SyntheticEvent<any>) => {
        this.setState({isVisible: false})

        if(this.props.onClose)
            this.props.onClose(event)
    }

    onClick = (event: React.MouseEvent<any>) => {
        // Don't allow click to propagate outside React.createPortal().
        event.stopPropagation()
    }

    // TODO: React | Fix keyboard event propagation to outside dialog (e.g. link insertion with enter).
    keyDown = (event: React.KeyboardEvent): void => {
        // Don't allow keyboard event to propagate outside React.createPortal().
        event.stopPropagation()

        const dialog = this.dialogElement.current
        if(this.props.onKeyDown && dialog)
            this.props.onKeyDown(dialog, event)

        if(event.keyCode === CHAR_CODE_ESCAPE)
            this.close(event)
    }

    render() {
        return (
            <Wrapper
                onClick={this.onClick}
                onKeyDown={this.keyDown}
                innerRef={this.dialogElement}
                tabIndex={1}
                visible={this.state.isVisible}
            >
                <Back onClick={this.close} />
                <Container>
                    <CloseButton onClick={this.close} right="5px" top="5px" size={22} />
                    <div>
                        <Title>
                            {this.props.title}
                        </Title>
                        {this.props.children}
                    </div>
                </Container>
            </Wrapper>
        )
    }
}


export default Dialog

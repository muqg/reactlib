import * as React from "react";
import { createPortal } from "react-dom";
import { COLOR_TRANSPARENT, css, styled } from "../../styles";
import { flex, position } from "../../styles/mixins";
import { wait } from "../../utility";
import { isUndefined } from "../../utility/assertions";
import { CHAR_CODE_ESCAPE, Hotkey, isKeyPressed } from "../../utility/dom";


const ESCAPE_HOTKEY = new Hotkey({keyCode: CHAR_CODE_ESCAPE})
const RENDER_WAIT_TIME = 35


const visibleStyle = css`
    opacity: 1;
    transform: scale(1);
    visibility: visible;
`
const Container = styled.div`
    background: ${COLOR_TRANSPARENT};
    box-sizing: border-box;
    height: 100%;
    opacity: 0;
    overflow: auto;
    padding: 60px 15px;
    transform: scale(1.5);
    transition: .25s;
    transition-property: opacity, transform, visibility;
    visibility: hidden;
    width: 100%;
    z-index: 200;
    ${position("fixed", "0", "", "", "0")}
    ${flex("center", "center")}

    ${(p: StyleProps) => p.visible && visibleStyle}

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #aaa;
        border-radius: 12px;
    }
`


interface StyleProps {
    visible?: boolean
}

interface OwnProps {
    children: (close: () => void, show: () => void) => React.ReactNode
}

export interface DialogProps {
    /**
     * Used for styling the outermost div container for the
     * dialog. Do NOT use to stlye any children elements.
     */
    className?: string
    /**
     * Whether the dialog is currently visible or not.
     */
    isVisible: boolean
    /**
     * Called when dialog is closed.
     */
    onClose?: () => void
    /**
     * Called any time a key is pressed down.
     *
     * - Escape key is bound by default to close the dialog.
     */
    onKeyDown?: (e: React.KeyboardEvent, dialog: HTMLDivElement) => void
    /**
     * Called when dialog is shown.
     */
    onShow?: (dialog: HTMLDivElement) => void
    /**
     * Called when dialog's visibility changes and is
     * typically used to mirror its visibility state.
     */
    visibilityChange?: (isVisible: boolean) => void
}

interface State {
    isVisible?: boolean
}

type Props = OwnProps & DialogProps


class Dialog extends React.PureComponent<Props, State> {
    state: State = {
        isVisible: this.props.isVisible
    }
    dialog = React.createRef<any>()

    async componentDidUpdate(prevProps: DialogProps, prevState: State) {
        const stateVisible = this.state.isVisible
        const propsVisible = this.props.isVisible

        if(propsVisible !== prevProps.isVisible && stateVisible !== propsVisible)
            this.toggle(propsVisible || false)


        const dialog = this.dialog.current
        if(!dialog)
            return

        if(stateVisible && !prevState.isVisible) {
            // Wait in order to allow for all elements to
            // fully render and allow proper interactions.
            await wait(RENDER_WAIT_TIME)
            dialog.focus()
            dialog.scrollTop = 0

            if(this.props.onShow)
                this.props.onShow(dialog)
        }
        else if(!stateVisible && prevState.isVisible) {
            if(this.props.onClose)
                this.props.onClose()
        }
    }

    toggle(visible?: boolean) {
        this.setState(prevState => {
            const isVisible = isUndefined(visible) ? !prevState.isVisible : visible

            if(this.props.visibilityChange)
                this.props.visibilityChange(isVisible)

            return {isVisible}
        })
    }

    keyDown = (event: React.KeyboardEvent) => {
        if(isKeyPressed(ESCAPE_HOTKEY, event))
            this.toggle(false)

        const dialog = this.dialog.current
        if(dialog && this.props.onKeyDown)
            this.props.onKeyDown(event, dialog)
    }

    render() {
        return createPortal(
            <Container
                className={this.props.className}
                ref={this.dialog}
                onKeyDown={this.keyDown}
                tabIndex={-1}
                visible={this.state.isVisible}
            >
                {this.state.isVisible &&
                    this.props.children(() => this.toggle(false), () => this.toggle(true))
                }
            </Container>,
            document.body
        )
    }
}


export { Dialog };


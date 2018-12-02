import * as React from "react";
import { createPortal } from "react-dom";
import { COLOR_TRANSPARENT, styled } from "../../styles";
import { flex, position } from "../../styles/mixins";
import { isUndefined } from "../../utility/assertions";
import { CHAR_CODE_ESCAPE, Hotkey, isKeyPressed } from "../../utility/dom";
import { call } from "../../utility/function";


const ESCAPE_HOTKEY = new Hotkey({keyCode: CHAR_CODE_ESCAPE})


const Container = styled.div`
    background: ${COLOR_TRANSPARENT};
    box-sizing: border-box;
    display: none;
    height: 100%;
    overflow: auto;
    width: 100%;
    z-index: 200;
    ${position("fixed", "0", "", "", "0")}

    ${(p: StyleProps) => p.visible && flex("center", "center")}

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

    componentDidUpdate(prevProps: DialogProps, prevState: State) {
        const stateVisible = this.state.isVisible
        const propsVisible = this.props.isVisible

        if(propsVisible !== prevProps.isVisible && stateVisible !== propsVisible)
            this.toggle(propsVisible || false)


        const dialog = this.dialog.current
        if(stateVisible && !prevState.isVisible && dialog) {
            requestAnimationFrame(() => {
                dialog.focus()
                dialog.scrollTop = 0
                call(this.props.onShow, dialog)
            })
        }
        else if(!stateVisible && prevState.isVisible) {
            call(this.props.onClose)
        }
    }

    toggle(visible?: boolean) {
        this.setState(prevState => {
            const isVisible = isUndefined(visible) ? !prevState.isVisible : visible

            call(this.props.visibilityChange, isVisible)

            return {isVisible}
        })
    }

    keyDown = (event: React.KeyboardEvent) => {
        if(isKeyPressed(ESCAPE_HOTKEY, event))
            this.toggle(false)

        const dialog = this.dialog.current
        if(dialog) {
            call(this.props.onKeyDown, event, dialog)
        }
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


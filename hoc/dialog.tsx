import * as React from "react";
import { COLOR_TRANSPARENT, css, styled } from "../styles";
import { wait } from "../utility";
import { CHAR_CODE_ESCAPE, Hotkey } from "../utility/dom";
import { isUndefined } from "../utility/assertions";


const ESCAPE_HOTKEY = new Hotkey(CHAR_CODE_ESCAPE)
const RENDER_WAIT_TIME = 35


const visibleStyle = css`
    opacity: 1;
    transform: scale(1);
    visibility: visible;
`
const Dialog = styled.div`
    align-items: center;
    background: ${COLOR_TRANSPARENT};
    box-sizing: border-box;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    overflow: auto;
    padding: 60px 15px;
    position: fixed;
    top: 0;
    transform: scale(1.5);
    transition: .25s;
    transition-property: opacity, transform, visibility;
    visibility: hidden;
    width: 100%;
    z-index: 200;

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

interface PrivateProps {
    /**
     * Closes the dialog.
     */
    closeDialog: () => void
    /**
     * Shows the dialog.
     */
    showDialog: () => void
}

interface PublicProps {
    /**
     * Used for styling the outermost div container for the
     * dialog. Do NOT use to stlye any children elements.
     */
    className?: string
    /**
     * A window-wide hotkey for the dialog.
     */
    globalHotkey?: Hotkey
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
    isVisible: boolean
}

export type InjectedDialogProps = PrivateProps
export type DialogProps = PublicProps


function dialog<OP extends {}>(WrappedComponent: React.ComponentType<OP & InjectedDialogProps>): React.ComponentType<OP & PublicProps> {

    class withDialog extends React.Component<OP & PublicProps, State> {
        static displayName: string

        state: State = {
            isVisible: false
        }
        dialog = React.createRef<HTMLDivElement>()

        componentDidMount() {
            if(this.props.globalHotkey)
                window.addEventListener("keydown", this.pressGlobal)
        }

        componentWillUnmount() {
            if(this.props.globalHotkey)
                window.addEventListener("keydown", this.pressGlobal)
        }

        async componentDidUpdate(prevProps: PublicProps, prevState: State) {
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

        click = (event: React.MouseEvent<any>) => {
            // Do NOT allow click evebt to propagate outside React.createPortal().
            event.stopPropagation()
        }

        keyDown = (event: React.KeyboardEvent) => {
            // Do NOT allow keyboard event to propagate outside React.createPortal().
            event.stopPropagation()

            if(this._isPressed(ESCAPE_HOTKEY, event))
                this.toggle(false)
            else
                this.pressGlobal(event.nativeEvent)

            const dialog = this.dialog.current
            if(dialog && this.props.onKeyDown)
                this.props.onKeyDown(event, dialog)
        }

        pressGlobal = (event: KeyboardEvent) => {
            const {globalHotkey} = this.props
            const target = event.target as HTMLElement | null

            if(!globalHotkey || !this._isPressed(globalHotkey!, event) || !target)
                return

            const node = target.nodeName
            if(node !== "INPUT" && node !== "TEXTAREA" && !target.hasAttribute("contenteditable"))
                this.toggle()
        }

        _isPressed(key: Hotkey, event: KeyboardEvent | React.KeyboardEvent) {
            return (
                key.code === event.keyCode &&
                key.alt === event.altKey &&
                key.ctrl === event.ctrlKey &&
                key.shift === event.shiftKey
            )
        }

        render() {
            return (
                <Dialog
                    className={this.props.className}
                    innerRef={this.dialog}
                    onClick={this.click}
                    onKeyDown={this.keyDown}
                    tabIndex={-1}
                    visible={this.state.isVisible}
                >
                    <WrappedComponent
                        {...this.props}
                        closeDialog={() => this.toggle(false)}
                        showDialog={() => this.toggle(true)}
                    />
                </Dialog>
            )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withDialog.displayName = `Dialog(${name})`
    return withDialog
}


export { dialog };

import * as React from "react";
import { styled, css } from "../styles";
import { wait } from "../utility";
import { CHAR_CODE_ESCAPE } from "../utility/dom";


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


interface StyleProps {
    visible?: boolean
}

interface Props {
    className?: string
    globalHotkey?: (e: KeyboardEvent) => boolean
    isVisible: boolean
    onClose: (dialog: HTMLDivElement) => void
    onKeyDown?: (e: React.KeyboardEvent, dialog: HTMLDivElement) => void
}
interface PrivateProps {
    dialogRef: React.RefObject<HTMLDivElement>
    onShow: (dialog: HTMLDivElement) => void
}
interface PublicProps {
    onShow?: (dialog: HTMLDivElement) => void
}

interface State {
    isVisible: boolean
}

export type DialogProps = Props & PrivateProps


function dialog<OP extends {}>(WrappedComponent: React.ComponentType<OP & DialogProps>): React.ComponentType<OP & Props & PublicProps> {

    class withDialog extends React.Component<OP & Props & PublicProps> {
        static displayName: string

        state: State = {
            isVisible: false
        }
        dialog = React.createRef<HTMLDivElement>()

        componentDidMount() {
            if(this.props.globalHotkey)
                window.addEventListener("keydown", this.hotkeyToggle)
        }

        componentWillUnmount() {
            if(this.props.globalHotkey)
                window.removeEventListener("keydown", this.hotkeyToggle)
        }

        async componentDidUpdate(prevProps: Props, prevState: State) {
            if(this.props.isVisible !== prevProps.isVisible && this.state.isVisible !== this.props.isVisible) {
                this.setState({isVisible: this.props.isVisible || false})
            }


            const dialog = this.dialog.current
            if(!dialog)
                return

            if(this.state.isVisible && !prevState.isVisible) {
                // Wait before calling open callback since dom interactions don't
                // always work correctly if children are not yet rendered or updated.
                await wait(30)
                dialog.focus()

                if(this.props.onShow)
                    this.props.onShow(dialog)
            }
            else if(!this.state.isVisible && prevState.isVisible) {
                if(this.props.onClose)
                    this.props.onClose(dialog)
            }
        }

        close = () => {
            this.setState({isVisible: false})
        }

        show = () => {
            this.setState({isVisible: true})
        }

        onClick = (event: React.MouseEvent<any>) => {
            // Don't allow click to propagate outside React.createPortal().
            event.stopPropagation()
        }

        // TODO: Lib | Fix keyboard event propagation to outside dialog (e.g. link insertion with enter).
        keyDown = (event: React.KeyboardEvent) => {
            // Don't allow keyboard event to propagate outside React.createPortal().
            event.stopPropagation()

            const dialog = this.dialog.current
            if(!dialog)
                return

            // Do NOT allow Escape key overriding.
            if(event.keyCode === CHAR_CODE_ESCAPE)
                this.props.onClose(dialog)
            else {
                if(this.props.onKeyDown)
                    this.props.onKeyDown(event, dialog)

                this.hotkeyToggle(event.nativeEvent)
            }
        }

        hotkeyToggle = (event: KeyboardEvent) => {
            const isHotkey = this.props.globalHotkey
            if(isHotkey && isHotkey(event)) {
                if(this.state.isVisible)
                    this.close()
                else
                    this.show()
            }
        }

        render() {
            return (
                <Wrapper
                    innerRef={this.dialog}
                    onClick={this.onClick}
                    onKeyDown={this.keyDown}
                    tabIndex={1}
                    visible={this.state.isVisible}
                >
                    <WrappedComponent
                        {...this.props}
                        dialogRef={this.dialog}
                        onClose={this.close}
                        onShow={this.show}
                    />
                </Wrapper>
            )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withDialog.displayName = `Dialog(${name})`
    return withDialog
}


export { dialog };

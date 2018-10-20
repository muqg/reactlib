import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { setToolbarVisibility } from "../../actions";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { isUndefined } from "../../utility/assertions";
import { CHAR_CODE_ENTER, Editor, isKeyPressed } from "../../utility/dom";


const Container = styled.div`
    border: ${COLOR_PRIMARY_LIGHT} 1px solid;
    box-sizing: border-box;
    min-height: 2.7em;
    outline: none;
    overflow: auto;
    padding: 5px;
`


interface DispatchProps {
    setToolbarVisibility: (isVisible: boolean) => void
}

interface OwnProps {
    className?: string
    content?: string
    contentChange?: (name: string, content: string) => void
    name?: string
    preventNewline?: boolean
    ref?: React.Ref<any>
}

interface State {
    content?: Props["content"]
}

type Props = OwnProps & DispatchProps


// TODO: Lib | OutsideAlerter for Toolbar.
class EditableContainer extends React.PureComponent<Props, State> {
    state: State = {}
    container = React.createRef<any>()

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if(isUndefined(prevState.content))
            return {content: nextProps.content}
        return prevState
    }

    handleChange = () => {
        Editor.saveSelection()

        const container: HTMLDivElement = this.container.current
        if(this.props.contentChange)
            this.props.contentChange(this.props.name || "", container.innerHTML)
    }

    handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault()

        const text = event.clipboardData.getData("text/plain")
        Editor.insertHTML(text)
    }

    preventNewline = (event: React.KeyboardEvent) => {
        if(isKeyPressed({keyCode: CHAR_CODE_ENTER}, event, true))
            event.preventDefault()
    }

    render() {
        return (
            <Container
                className={this.props.className}
                contentEditable

                onBlur={this.handleChange}
                onKeyPress={this.props.preventNewline ? this.preventNewline : undefined}
                onInput={this.handleChange}
                onPaste={this.handlePaste}

                ref={this.container}

                dangerouslySetInnerHTML={{__html: this.state.content || ""}}
            />
        )
    }
}


const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        setToolbarVisibility: (isVisible: boolean) => dispatch(setToolbarVisibility(isVisible))
    }
}

const container = connect(null, mapDispatchToProps)(EditableContainer) as React.ComponentType<OwnProps>
export { container as EditableContainer };


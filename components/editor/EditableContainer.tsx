import * as React from "react";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { CHAR_CODE_ENTER, Editor, isKeyPressed } from "../../utility/dom";


const Container = styled.div`
    border: ${COLOR_PRIMARY_LIGHT} 1px solid;
    box-sizing: border-box;
    min-height: 2.7em;
    outline: none;
    overflow: auto;
    padding: 5px;
`

interface Props {
    className?: string
    content?: string
    contentChange?: (name: string, content: string) => void
    /**
     * Indicates whether content is expected to be delayed
     * e.g. awaiting an API call and a state update.
     */
    delayedContent?: boolean
    name?: string
    preventNewline?: boolean
    ref?: React.Ref<any>
}

interface State {
    content?: Props["content"]
}


class EditableContainer extends React.PureComponent<Props, State> {
    state: State = {
        content: this.props.content
    }
    container = React.createRef<any>()

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if(!prevState.content && nextProps.content && nextProps.delayedContent)
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
                spellCheck={false}

                dangerouslySetInnerHTML={{__html: this.state.content || ""}}
            />
        )
    }
}


export { EditableContainer };


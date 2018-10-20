import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { setToolbarVisibility } from "../../actions";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { CHAR_CODE_ENTER, Editor, isKeyPressed } from "../../utility/dom";


const Container = styled.div`
    border: ${COLOR_PRIMARY_LIGHT} 1px solid;
    box-sizing: border-box;
    outline: none;
    overflow: auto;
    padding: 5px;
`


interface DispatchProps {
    setToolbarVisibility: (isVisible: boolean) => void
}

interface OwnProps {
    className?: string
    name?: string
    onChange?: (event: React.SyntheticEvent<HTMLDivElement>) => void
    preventNewline?: boolean
    value?: string
}

interface State {
}

type Props = OwnProps & DispatchProps


// TODO: Lib | OutsideAlerter for Toolbar.
class EditableContainer extends React.PureComponent<Props, State> {
    state = {}

    handleChange = (event: React.SyntheticEvent<HTMLDivElement>) => {
        Editor.saveSelection()

        if(this.props.onChange)
            this.props.onChange(event)
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
                // @ts-ignore Make component completely compatible with model functions
                name={this.props.name}

                onBlur={this.handleChange}
                onKeyPress={this.props.preventNewline ? this.preventNewline : undefined}
                onInput={this.handleChange}
                onPaste={this.handlePaste}

                dangerouslySetInnerHTML={{__html: this.props.value || ""}}
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


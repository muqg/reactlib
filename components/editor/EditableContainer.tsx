import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { setToolbarVisibility } from "../../actions";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { Editor } from "../../utility/dom";


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
    onChange?: (event: React.SyntheticEvent<HTMLDivElement>) => void
    content?: string
}

interface State {
}

type Props = OwnProps & DispatchProps


// TODO: React | OutsideAlerter for Toolbar.
class EditableContainer extends React.PureComponent<Props, State> {
    state = {}
    container = React.createRef<HTMLDivElement>()

    handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        Editor.saveSelection()

        if(this.props.onChange)
            this.props.onChange(event)
    }

    handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault()

        const text = event.clipboardData.getData("text/plain")
        Editor.insertHTML(text)
    }

    render() {
        return (
            <Container
                className={this.props.className}
                innerRef={this.container}
                contentEditable

                onBlur={this.handleBlur}
                onInput={this.props.onChange}
                onPaste={this.handlePaste}

                dangerouslySetInnerHTML={{__html: this.props.content || ""}}
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

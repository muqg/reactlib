import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { setToolbarVisibility } from "../../actions";
import { Editor } from "../../utility/dom";


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
            <div
                className={this.props.className}
                ref={this.container}
                contentEditable

                onBlur={this.handleBlur}
                onInput={this.props.onChange}
                onPaste={this.handlePaste}

                dangerouslySetInnerHTML={{__html: this.props.content || ""}}
            >
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        setToolbarVisibility: (isVisible: boolean) => dispatch(setToolbarVisibility(isVisible))
    }
}

const container = connect(null, mapDispatchToProps)(EditableContainer) as React.ComponentType<OwnProps>
export { container as EditableContainer }

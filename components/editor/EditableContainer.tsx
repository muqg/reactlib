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
class EditableContainer extends React.Component<Props, State> {
    container = React.createRef<HTMLDivElement>()

    constructor(public props: Props) {
        super(props)

        this.state = {}
    }

    handleBlur(event: React.FocusEvent<any>) {
        Editor.saveSelection()

        if(this.props.onChange)
            this.props.onChange(event)
    }

    handlePaste(event: React.ClipboardEvent<any>) {
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

                onBlur={() => { Editor.saveSelection() }}
                onInput={this.props.onChange}
                onPaste={this.handlePaste.bind(this)}

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

export default connect(null, mapDispatchToProps)(EditableContainer) as React.ComponentType<OwnProps>

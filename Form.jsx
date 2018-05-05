import * as React from "react"
// TODO: React | Check logic and necessity.

class Form extends React.Component {
    /**
     *
     * @param {object} props Used props are:
     *  - name --> form name
     *  - onChange --> callback for when form data changes
     *  - submit --> callback for when form is submitted
     */
    constructor(props) {
        super(props)

        this.state = {}
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const target = e.target
        const value = target.type === "checkbox" ? target.checked : target.value
        const name = target.name

        if(!name)
            throw("Name attribute is required for nodes using Form.formChanged method.")

        this.setState({
            [name]: value
        })

        if(typeof this.props.onChange === "function")
            this.props.onChange(e, this.state, this.props.name)
    }

    submit() {
        if(typeof this.props.submit === "function")
            this.props.submit(this.state, this.props.name)
    }

    render() {
        return(
            // TODO: Decide on how to pass callback to children and be reusable.
            <React.Fragment>

            </React.Fragment>
        )
    }
}


export default Form

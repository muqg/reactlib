import * as React from "react"
import { parseFormElement } from "../utility"

/**
 * - handleChange - A callback(data, elementData) for when a form element changes.
 * - handleSubmit - A callback(data) for when form is submitted.
 * - initialData - Optional initial serialized data (state) for the form.
 */
function Serialization(WrappedComponent) {

    class withSerialization extends React.Component {
        constructor(props) {
            super(props)

            this.initialState = this.props.initialData || {}
            this.state = {...this.initialState}

            this.onChange = typeof this.props.handleChange === "function" ?
                this.props.handleChange :
                () => {}
            this.onSubmit = typeof this.props.handleSubmit === "function" ?
                this.props.handleSubmit :
                () => {}
        }

        handleChange(e) {
            e.preventDefault();

            const elementData = parseFormElement(e.target)
            this.setState({
                ...this.state,
                ...elementData
            },
            () => {
                this.onChange(this.state, elementData)
            })
        }

        handleSubmit(e) {
            e.preventDefault();

            this.onSubmit(this.state)
            // TODO: React | fix form not resetting.
            this.setState(this.initialState)
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    initialData={this.initialState}
                    handleChange={(e) => { this.handleChange(e) }}
                    handleSubmit={(e) => { this.handleSubmit(e) }}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withSerialization.displayName = `withSerialization(${name})`
    return withSerialization
}


export default Serialization

import * as React from "react"
import { parseFormElement } from "../utility/dom"
import { def } from "../utility/assertions";

export interface SerializationProps {
    /**
     * Accepts a callback for when change occurs on a serialized element.
     */
    handleChange: (event: React.ChangeEvent<any>, callback?:(serializedData: {}, changeData: {}) => void) => void
    /**
     * Accepts a callback for when serialized data should be submitted.
     */
    handleSubmit: (event: React.SyntheticEvent<any>, callback?: (serializedData: {}) => void) => void
    /**
     * Holds the serialized data. Should be used to initially set values of
     * elements. Callbacks should be used for any direct manipulation.
     */
    serializedData: {}
}

/**
 * Enhances a component with serialization, passing SerializationProps with
 * handleChange and handleSubmit callbacks.
 * @param WrappedComponent The component to be wrapped.
 * @param initialData Initial serialized data.
 */
function Serialization(WrappedComponent: any, initialData?: {}) {

    class withSerialization extends React.Component {
        static displayName: string
        initialState: object

        constructor(public props: any) {
            super(props)

            this.initialState = def(initialData, {})
            this.state = {...this.initialState}
        }

        handleChange(event: React.ChangeEvent<any>, callback?:(serializedData: {}, changeData: {}) => void) {
            const elementData = parseFormElement(event.target)
            this.setState({
                ...this.state,
                ...elementData
            },
            () => {
                if(callback)
                    callback(this.state, elementData)
            })
        }

        handleSubmit(event: React.SyntheticEvent<any>, callback?: (serializedData: {}) => void) {
            event.preventDefault();
            if(callback)
                callback(this.state)
            // Reset serialized elements to passed initial state data.
            this.setState(this.initialState)
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    serializedData={this.state}
                    handleChange={this.handleChange.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withSerialization.displayName = `withSerialization(${name})`
    return withSerialization
}


export default Serialization

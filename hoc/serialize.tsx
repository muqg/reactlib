import * as React from "react"
import { parseFormElement } from "../utility/dom"
import { def, isUndefined } from "../utility/assertions";

export interface SerializationProps {
    /**
     * Handles data serialization an input element changes and accepts a callback
     * that may handle any specific change behaviour.
     */
    readonly handleChange: (event: React.ChangeEvent<any>, callback?:(serializedData: {}, changeData: {}) => void) => void
    /**
     * Handles basic data submission and accepts a callback that handles specific
     * behaviour.
     * - The callback can optionally return True or False to indicate whether
     * submission was successful or not.
     * - The callback may be async.
     */
    readonly handleSubmit: (event: React.SyntheticEvent<any>, callback?: (serializedData: {}) => boolean | undefined) => void
    /**
     * Allows to set the initial data's value from inside the wrapped component.
     * This method can only be called once and before the change or submission
     * methods are called.
     */
    readonly setInitialDataBeforeChanged: (initialData: object) => void
    /**
     * Holds the serialized data. Should be used to initially set values of
     * elements. Callbacks should be used for any direct manipulation.
     */
    readonly serializedData: {}
}

/**
 * Enhances a component with serialization. See SerializationProps for more info.
 * @param WrappedComponent The component to be wrapped.
 * @param initialData Initial serialized data.
 */
// TODO: React | implement verification somehow.
// TODO: React | implement 'required' check.
function Serialization(WrappedComponent: any, initialData?: {}) {

    class withSerialization extends React.Component {
        static displayName: string
        private hasChanged = false
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
            this.hasChanged = true
        }

        async handleSubmit(event: React.SyntheticEvent<any>, callback?: (serializedData: {}) => boolean | undefined) {
            event.preventDefault();

            let success = true
            if(callback) {
                // Allow async callback.
                const res = await callback(this.state)
                success = !isUndefined(res) ? res : success
            }

            // Reset serialized elements to passed initial state data on success.
            if(success)
                this.setState(this.initialState)

            this.hasChanged = true
        }

        setInitialDataBeforeChanged(initialData: object) {
            if(!this.hasChanged) {
                this.initialState = def(initialData, {})
                this.hasChanged = true
            }
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    serializedData={this.state}
                    handleChange={this.handleChange.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                    setInitialDataBeforeChange={this.setInitialDataBeforeChanged.bind(this)}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withSerialization.displayName = `withSerialization(${name})`
    return withSerialization
}

export {
    Serialization as serialize
}

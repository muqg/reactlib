import * as React from "react";
import { StringDict } from "../utility";
import { def, isString, isUndefined } from "../utility/assertions";
import { ParsedObject, parseFormElement } from "../utility/dom";

export interface SerializationProps {
    /**
     * Handles data serialization an input element changes and accepts a callback
     * that may handle any specific change behaviour.
     * - The callback can optionally return True or False to indicate whether
     * the serialized value is valid or not. Always considered valid by default.
     * - The callback may be async.
     */
    readonly handleChange: (
        event: React.ChangeEvent<HTMLFormElement>,
        callback?:(changeData: string | ParsedObject) => boolean | undefined
    ) => void
    /**
     * Handles basic data submission and accepts a callback that handles specific
     * behaviour.
     * - The callback can optionally return True or False to indicate whether
     * submission was successful or not. Always considered successful by default.
     * - The callback may be async.
     */
    readonly handleSubmit: (
        event: React.SyntheticEvent<any>,
        callback?: (serializedData: SerializationProps["serializedData"]) => boolean | undefined
    ) => void
    /**
     * Allows to set the initial data's value from inside the wrapped component.
     * This method can only be called once and before the change or submission
     * methods are called.
     */
    readonly setInitialDataBeforeChanged: (initialData: SerializationProps["serializedData"]) => void
    /**
     * Holds the serialized data. Should be used to initially set values of
     * elements. Callbacks should be used for any direct manipulation.
     */
    readonly serializedData: StringDict<string | ParsedObject>
}


/**
 * Enhances a component with serialization. See SerializationProps for more info.
 * @param WrappedComponent The component to be wrapped.
 * @param initialData Initial serialized data.
 */
// TODO: React | implement 'required' check. Try with findDOMNode(this).querySelectorAll([required])
// and recording the names into an array to check from.
function Serialization(WrappedComponent: any, initialData?: SerializationProps["serializedData"]) {

    class withSerialization extends React.Component {
        static displayName: string
        private hasChanged = false
        initialState: SerializationProps["serializedData"]
        state: SerializationProps["serializedData"]

        constructor(public props: any) {
            super(props)

            this.initialState = def(initialData, {}) as SerializationProps["serializedData"]
            this.state = {...this.initialState}
        }

        // TODO: React | Allow parseFormElement to serialize data-* attributes.
        // Then implement overloads properly to indicate return type of string or
        // object respectively.
        async handleChange(
            event: React.ChangeEvent<HTMLFormElement>,
            callback?:(changeData: string | ParsedObject) => boolean | undefined
        ) {
            this.hasChanged = true

            const name = event.target.name
            let elementData = parseFormElement(event.target)

            let isDataValid = true
            if(callback) {
                const res = await callback(elementData)
                isDataValid = !isUndefined(res) ? res : isDataValid
            }

            if(!isDataValid) {
                if(isString(elementData))
                    elementData = ""
                else
                    elementData.value = ""
            }

            this.setState({
                ...this.state,
                [name]: elementData
            })
        }

        async handleSubmit(
            event: React.SyntheticEvent<any>,
            callback?: (serializedData: SerializationProps["serializedData"]) => boolean | undefined
        ) {
            event.preventDefault();
            this.hasChanged = true

            let success = true
            if(callback) {
                // Allow async callback.
                const res = await callback(this.state)
                success = !isUndefined(res) ? res : success
            }

            // Reset serialized elements to passed initial state data on success.
            if(success)
                this.setState(this.initialState)
        }

        setInitialDataBeforeChanged(initialData: SerializationProps["serializedData"]) {
            if(!this.hasChanged) {
                this.initialState = def(initialData, {}) as SerializationProps["serializedData"]
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

export { Serialization as serialize };


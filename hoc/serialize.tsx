import * as React from "react";
import { StringDict } from "../utility";
import { def, isUndefined, isObject } from "../utility/assertions";
import { parseFormElement, findParentWithClass } from "../utility/dom";

export interface SerializationProps {
    /**
     * Handles data serialization an input element changes and accepts a callback
     * that may handle any specific change behaviour.
     * - The callback can optionally return True or False to indicate whether
     * the serialized value is valid or not. Always considered valid by default.
     * - The callback may be async.
     */
    handleChange(
        event: React.ChangeEvent<HTMLElement>,
        callback?:(newData: string, targetElement: HTMLFormElement) => boolean | undefined
    ): void

    /**
     * Handles basic data submission and accepts a callback that handles specific
     * behaviour.
     * - The callback can optionally return True or False to indicate whether
     * submission was successful or not. Always considered successful by default.
     * - The callback may be async.
     */
    handleSubmit(
        event: React.SyntheticEvent<any>,
        callback?: (serializedData: SerializationProps["serializedData"]) => boolean | undefined
    ): void

    /**
     * Allows to set the initial data's value from inside the wrapped component.
     * This method can only be called once and before the change or submission
     * methods are called.
     */
    setInitialDataBeforeChanged(initialData: SerializationProps["serializedData"]): void

    /**
     * Directory serializes a value without any further processing. This method
     * should only be used if serialization cannot be achieved in another way
     * and it assumes that any verification and other processing is done and
     * method receives the final value.
     */
    serializeValue(name: string, value: string | number | object | Array<any>): void

    /**
     * Holds the serialized data. Should be used to initially set values of
     * elements. Callbacks should be used for any direct manipulation.
     */
    serializedData: StringDict<string>
}

interface WrapperState {
    validData: SerializationProps["serializedData"]
    inputData: SerializationProps["serializedData"]
}

/**
 * Enhances a component with serialization. See SerializationProps for more info.
 * @param WrappedComponent The component to be wrapped.
 * @param initialData Initial serialized data.
 */
function Serialization<P extends {}>(
    WrappedComponent: React.ComponentType<P & SerializationProps>,
    initialData?: SerializationProps["serializedData"]): React.ComponentType<P>
{

    class withSerialization extends React.Component<P> {
        static displayName: string

        state: WrapperState
        initialState: SerializationProps["serializedData"]

        private hasChanged = false

        constructor(public props: any) {
            super(props)

            this.initialState = def(initialData, {}) as SerializationProps["serializedData"]
            this.state = {
                validData: {...initialData},
                inputData: {...initialData}
            }
        }

        async handleChange(
            event: React.ChangeEvent<HTMLFormElement>,
            callback?:(newData: string, targetElement: HTMLFormElement) => boolean | undefined
        ) {
            this.hasChanged = true

            const targetElement = event.target as HTMLFormElement
            let name = targetElement.name
            let elementData = ""

            // TODO: React | This is only a temporary fix for l_select serialization.
            // Attempt to better fix it by capturing and re-dispatching event on the select itself.
            const parentSelect = findParentWithClass(targetElement, "l_select")
            if((targetElement.type === "checkbox" || targetElement.type === "radio") && parentSelect) {
                name = parentSelect.dataset["name"] || ""
                elementData = targetElement.value
            }
            else {
                elementData = parseFormElement(targetElement)
            }

            let isDataValid = true
            if(callback) {
                const res = await callback(elementData, targetElement)
                isDataValid = !isUndefined(res) ? res : isDataValid
            }

            this.setState({
                validData: {
                    ...this.state.validData,
                    [name]: isDataValid ? elementData : ""
                },
                inputData: {
                    ...this.state.inputData,
                    [name]: elementData
                }
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
                const res = await callback(this.state.validData)
                success = !isUndefined(res) ? res : success
            }

            // Reset serialized elements to passed initial state data on success.
            if(success) {
                this.setState({
                    validData: {...this.initialState},
                    inputData: {...this.initialState}
                })
            }
        }

        setInitialDataBeforeChanged(initialData: SerializationProps["serializedData"]) {
            if(!this.hasChanged) {
                this.initialState = def(initialData, {}) as SerializationProps["serializedData"]
                this.setState({
                    validData: {...this.initialState},
                    inputData: {...this.initialState}
                })
                this.hasChanged = true
            }
        }


        serializeValue(name: string, value: string): void
        serializeValue(name: string, value: number): void
        serializeValue(name: string, value: object | Array<any>): void
        serializeValue(name: string, value: any) {
            if(isObject(value))
                value = JSON.stringify(value)

            this.setState({
                validData: {
                    ...this.state.validData,
                    [name]: value.toString()
                },
                inputData: {
                    ...this.state.inputData,
                    [name]: value.toString()
                }
            })
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    serializedData={this.state.inputData}
                    handleChange={this.handleChange.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                    setInitialDataBeforeChanged={this.setInitialDataBeforeChanged.bind(this)}
                    serializeValue={this.serializeValue.bind(this)}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withSerialization.displayName = `withSerialization(${name})`
    return withSerialization
}

export { Serialization as serialize };


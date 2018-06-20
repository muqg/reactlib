import * as React from "react";
import { StringDict } from "../utility";
import { def, isBoolean } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass, parseFormElement } from "../utility/dom";

/**
 * __NOTE__: The generic typing does __NOT__ guarantee type safety and is there
 * for convenience.
 */
export interface SerializationProps<SD extends object = StringDict<any>> {
    /**
     * Handles data serialization an input element changes and accepts a callback
     * that may handle any specific change behaviour.
     * - The callback can optionally return True or False to indicate whether
     * the serialized value is valid or not. Always considered valid by default.
     * - The callback may be async.
     */
    srlzChange(event: React.ChangeEvent<HTMLElement>, callback?: ChangeCallback): Promise<void>


    /**
     * Handles basic data submission and accepts a callback that may handle
     * any specific behaviour.
     * - The callback can optionally return True or False to indicate whether
     *   to reset serialized data to the inital one.
     * - The generic typing does __NOT__ guarantee type safety and is there for
     *   convenience.
     */
    srlzSubmit<SP extends object = SD>
        (event: React.SyntheticEvent<any>, callback: SubmissionCallback<SP>): Promise<void>

    /**
     * Allows to set the initial data's value from inside the wrapped component.
     * This method can only be called once and before the change or submission
     * methods are called.
     */
    setInitialDataBeforeChanged(initialData: SD): void

    /**
     * Serializes a value.
     */
    serializeValue(name: string, value: any): void
    /**
     * Serializes a value if it is valid or undefined otherwise.
     */
    serializeValue(name: string, value: any, isValid: boolean): void

    /**
     * Holds the serialized data. Should be used to initially set values of
     * elements. Callbacks should be used for any direct manipulation.
     */
    serializedData: SD
}

interface WrapperState {
    /**
     * The validated data.
     */
    validData: SerializationProps["serializedData"]
    /**
     * The input data (without validation).
     */
    inputData: SerializationProps["serializedData"]
}

type CallbackReturnValue = boolean | void | Promise<boolean> | Promise<void>
type SubmissionCallback<SP extends object = SerializationProps["serializedData"]> = (serializedData: SP) => CallbackReturnValue
type ChangeCallback = (newData: string, targetElement: HTMLElement) => CallbackReturnValue



/**
 * Enhances a component with serialization. See SerializationProps for more info.
 * @param WrappedComponent The component to be wrapped.
 * @param initialData Initial serialized data.
 */
function Serialization<OP extends {}, SD extends object = SerializationProps["serializedData"]>(
    WrappedComponent: React.ComponentType<OP & SerializationProps<SD>>,
    initialData?: SerializationProps["serializedData"]): React.ComponentType<OP>
{

    class withSerialization extends React.Component<OP, WrapperState> {
        static displayName: string
        initialState: SerializationProps["serializedData"]
        hasChanged: boolean = false

        constructor(public props: any) {
            super(props)

            this.initialState = def(initialData, {}) as SerializationProps["serializedData"]
            this.state = {
                validData: {...initialData},
                inputData: {...initialData}
            }
        }

        componentDidUpdate() {
            this.hasChanged = true
        }

        async handleChange(event: React.ChangeEvent<HTMLElement>, callback: ChangeCallback = () => {}) {
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

            // Allow async callback.
            const res = await callback(elementData, targetElement)
            const isDataValid = isBoolean(res) ? res : true

            this.serializeValue(name, elementData, isDataValid)
        }

        async handleSubmit(
            event: React.SyntheticEvent<any>,
            callback: SubmissionCallback = () => {}
        ) {
            event.preventDefault();

            // Allow async callback.
            const res = await callback(this.state.validData)
            const success = isBoolean(res) ? res : true

            // Reset serialized elements to passed initial state data on success.
            if(success)
                this._reset()
        }

        setInitialDataBeforeChanged(initialData: SerializationProps["serializedData"]) {
            if(this.hasChanged)
                return
            this.initialState = {...initialData}
            this._reset()
        }

        serializeValue(name: string, value: any, isValid = true) {
            this.setState(prevState => {
                return {
                    validData: {...dive(name, (isValid ? value : undefined), prevState.validData)},
                    inputData: {...dive(name, value, prevState.inputData)}
                }
            })
        }

        _reset() {
            this.setState({
                validData: {...this.initialState},
                inputData: {...this.initialState}
            })
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    serializedData={this.state.inputData}
                    srlzChange={this.handleChange.bind(this)}
                    srlzSubmit={this.handleSubmit.bind(this)}
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


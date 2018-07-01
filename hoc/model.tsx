import * as React from "react";
import { StringDict } from "../utility";
import { def, isBoolean } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass, parseFormElement } from "../utility/dom";

/**
 * __NOTE__: The generic typing does __NOT__ guarantee type safety and is there
 * for convenience.
 */
export interface ModelProps<MD extends object = StringDict<any>> {
    model: Model<MD>
}


interface Model<MD extends object = StringDict<any>> {
    /**
     * Handles data change of an input element and accepts a callback that may
     * handle any specific change behaviour.
     * - The callback can optionally return True or False to indicate whether
     * the value is valid or not. Always considered valid by default.
     * - The callback may be async.
     * - Causes a re-render (with the new model data).
     */
    change(event: React.ChangeEvent<HTMLElement>, callback?: ChangeCallback): Promise<void>


    /**
     * Handles basic data submission and accepts a callback that may handle
     * any specific behaviour.
     * - The generic typing does __NOT__ guarantee type safety and is there for
     *   convenience.
     */
    submit<MP extends object = MD>
        (event: React.SyntheticEvent<any>, callback: SubmissionCallback<MP>): Promise<void>

    /**
     * Sets the base model data to the passed object, overwriting any previous data.
     * - Calls the reset method of the model and thus causes a re-render.
     */
    setBaseData(base: MD): void

    /**
     * Sets a model value to the passed value if it is valid or undefined otherwise.
     * - Value is assumed valid by default.
     * - Causes a re-render (with the new model data).
     */
    setValue(name: string, value: any, isValid?: boolean): void

    /**
     * Resets to the base data and causes a re-render.
     */
    reset(): void

    /**
     * Holds the model's data. Should be used to initially set values of elements.
     * Callbacks should be used for any direct manipulation.
     */
    data: MD
}

interface WrapperState {
    /**
     * The validated data.
     */
    validData: Model["data"]
    /**
     * The input data (without validation).
     */
    inputData: Model["data"]
}

type CallbackReturnValue = boolean | void | Promise<boolean> | Promise<void>
type SubmissionCallback<SP extends object = Model["data"]> = (modelData: SP) => CallbackReturnValue
type ChangeCallback = (newData: string, targetElement: HTMLElement) => CallbackReturnValue



/**
 * Enhances a component with model serialization. See ModelProps for more info.
 * @param WrappedComponent The component to be wrapped.
 * @param baseData Model's base data.
 */
function CreateModel<OP extends {}, MD extends object = Model["data"]>(
    WrappedComponent: React.ComponentType<OP & ModelProps<MD>>,
    baseData?: Model["data"]): React.ComponentType<OP>
{

    class withModel extends React.Component<OP, WrapperState> {
        static displayName: string
        state: WrapperState
        baseData: Model["data"]
        hasChanged = false

        constructor(public props: any) {
            super(props)

            this.baseData = def(baseData, {}) as Model["data"]
            this.state = {
                validData: {...baseData},
                inputData: {...baseData}
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

            this.setValue(name, elementData, isDataValid)
        }

        async handleSubmit(
            event: React.SyntheticEvent<any>,
            callback: SubmissionCallback = () => {}
        ) {
            event.preventDefault();

            // Allow async callback.
            await callback(this.state.validData)
        }

        setBaseData(baseData: Model["data"]) {
            this.baseData = {...baseData}
            this.reset()
        }

        setValue(name: string, value: any, isValid = true) {
            this.setState(prevState => {
                return {
                    validData: {...dive(name, (isValid ? value : undefined), prevState.validData)},
                    inputData: {...dive(name, value, prevState.inputData)}
                }
            })
        }

        reset() {
            this.setState({
                validData: {...this.baseData},
                inputData: {...this.baseData}
            })
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    model={{
                        data: this.state.inputData,
                        change: this.handleChange.bind(this),
                        submit: this.handleSubmit.bind(this),
                        setValue: this.setValue.bind(this),
                        setBaseData: this.setBaseData.bind(this),
                        reset: this.reset.bind(this)
                    } as Model}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withModel.displayName = `withModel(${name})`
    return withModel
}

export { CreateModel as model };


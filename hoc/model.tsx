import * as React from "react";
import { StringDict } from "../utility";
import { def } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass, parseFormElement } from "../utility/dom";

/**
 * __NOTE__: The generic typing does __NOT__ guarantee type safety and is there
 * for convenience.
 */
export interface ModelProps<MD extends object = StringDict<any>> {
    readonly model: Model<MD>
}


interface Model<MD extends object = StringDict<any>> {
    /**
     * Handles data change of an input element and accepts a callback that may
     * handle any specific change behaviour.
     * - The callback may be async and will be awaited for.
     * - Causes a re-render (with the new model data).
     */
    change(event: React.ChangeEvent<HTMLElement>, callback?: ChangeCallback): Promise<void>


    /**
     * Handles basic data submission and accepts a callback that may handle
     * any specific behaviour.
     * - The callback may be async and will be awaited for.
     */
    submit<MP extends object = MD>(event: React.SyntheticEvent<any>, callback: SubmissionCallback<MP>): Promise<void>

    /**
     * Sets the base model data to the passed object, overwriting any previous data.
     * - Calls the reset method of the model and thus causes a re-render.
     */
    setBaseData(base: MD): void

    /**
     * Sets a model value.
     * - Causes a re-render (with the new model data).
     */
    setValue(name: string, value: any): void

    /**
     * Resets to the base data and causes a re-render.
     */
    reset(): void

    /**
     * Holds the model's data. Should be used to initially set values of elements.
     * Callbacks should be used for any direct manipulation.
     */
    readonly data: MD
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

    class withModel extends React.Component<OP, Model["data"]> {
        static displayName: string

        baseData = def(baseData, {}) as Model["data"]
        state: Model["data"] = {...baseData}

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
            await callback(elementData, targetElement)

            this.setValue(name, elementData)
        }

        async handleSubmit(event: React.SyntheticEvent<any>, callback: SubmissionCallback = () => {}) {
            event.preventDefault();

            // Allow async callback.
            await callback({...this.state})
        }

        setBaseData(baseData: Model["data"]) {
            this.baseData = {...baseData}
            this.reset()
        }

        setValue(name: string, value: any) {
            this.setState(prevState => {
                return {...dive(name, value, prevState)}
            })
        }

        reset() {
            this.setState({...this.baseData})
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    model={{
                        data: {...this.state},
                        change: this.handleChange.bind(this),
                        submit: this.handleSubmit.bind(this),
                        setValue: this.setValue.bind(this),
                        setBaseData: this.setBaseData.bind(this),
                        reset: this.reset.bind(this)
                    } as Model<MD>}
                />
             )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withModel.displayName = `withModel(${name})`
    return withModel
}

export { CreateModel as model };


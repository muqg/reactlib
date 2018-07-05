import * as React from "react";
import { Dict } from "../utility";
import { isObject } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass } from "../utility/dom";


export interface ModelProps<MD extends object = Dict<any>> {
    readonly model: Model<MD>
}


export interface Model<MD extends object = Dict<any>> {
    /**
     * Handles data change for a valid form control event and causes a re-render.
     *
     * - The form control must have a name and a value attribute.
     */
    change(event: ChangeEvent): void | Promise<void>

    /**
     * Sets an object of name/value pairs to the model data. This may be used to
     * set multiple values or set deeply nested values by passing a nested object
     * or a dot notation name with an object value to insert at the desired
     * nested key.
     */
    value(values: MD | Dict<any>): void | Promise<void>

    /**
     * Resets to the base data and causes a re-render. Any value using Model's
     * data will be reset to its base value if one has been provided.
     */
    reset(): void | Promise<void>
    /**
     * Sets the base model data to the passed data object, overwriting any previous
     * data or creating a shallow merge of the existing base data and the new data
     * if merge is True and then resets the Model's data and causes a re-render.
     */
    reset(data?: MD | Dict<any>, merge?: boolean): void | Promise<void>

    /**
     * Readable Model data. Use methods to set changes to this data.
     *
     * __NOTE__: Never pass model data non-primitive values to child components
     * since this will cause them to re-render anytime model changes. Use separate
     * model for each component that requires to have its data modelled and then
     * combine the models via model methods.
     */
    data: MD
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>



/**
 * Enhances a component with model serialization. See ModelProps for more info.
 * @param WrappedComponent The component to be wrapped.
 */
function CreateModel<OP extends {}, MD extends object = Model["data"]>(
    WrappedComponent: React.ComponentType<OP & ModelProps<MD>>
): React.ComponentType<OP> {

    class withModel extends React.Component<OP, Model["data"]> {
        static displayName: string

        baseData = {} as Model["data"]
        state = {} as Model["data"]

        change = async (event: ChangeEvent) => {
            const element = event.target
            let name = element.name
            let value = element.value

            const parentSelect = findParentWithClass(element, "l_select")
            if((element.type === "checkbox" || element.type === "radio") && parentSelect) {
                name = parentSelect.dataset["name"] || ""
            }
            else if(isObject(element, HTMLSelectElement) && element.multiple) {
                value = Object.values(element.options)
                    .filter(o => o.selected)
                    .map(o => o.value).join(",")
            }

            this.value({
                [name]: value
            })
        }

        value = async (values: Dict<any>) => {
            this.setState(prevState => {
                let newState = {...prevState}
                Object.entries(values).forEach(([k, v]) => newState = dive(k, v, newState))

                return newState
            })
        }

        reset = async (data?: Model["data"], merge?: boolean) => {
            if(data)
                this.baseData = merge ? {...this.baseData, ...data} : {...data}
            this.setState(this.baseData)
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    model={{
                        data: this.state,
                        change: this.change,
                        value: this.value,
                        reset: this.reset,
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


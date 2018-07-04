import * as React from "react";
import { Dict } from "../utility";
import { isObject } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass } from "../utility/dom";


export interface ModelProps<MD extends object = Dict<any>> {
    readonly model: Model<MD>
}


interface Model<MD extends object = Dict<any>> {
    /**
     * Handles data change for a valid form control event and causes a re-render.
     */
    change(event: ChangeEvent): void

    /**
     * Sets the base model data to the passed object, overwriting any previous
     * data or creating a shallow merge of the existing base data and the new
     * base data if merge is True. Calls the reset method of the model and thus
     * causes a re-render.
     */
    setBaseData(base: MD, merge?: boolean): void

    /**
     * Sets a model value and causes a re-render.
     */
    setValue(name: string, value: any): void

    /**
     * Allows to batch set values to the model in order to prevent possible
     * multiple re-renders, in cases where multiple calls to setValue are needed.
     * - Object entries represent the values as name/value pairs.
     */
    setValues(values: Dict<any>): void

    /**
     * Resets to the base data and causes a re-render. Any value using Model's
     * data will be reset to its base value if one has been provided.
     */
    reset(): void

    /**
     * Readable Model data. Use methods to set changes to this data.
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

        change(event: ChangeEvent) {
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

            this.setValue(name, value)
        }

        setBaseData(baseData: Model["data"], merge: boolean = false) {
            this.baseData = merge ? {...this.baseData, ...baseData} : {...baseData}
            this.reset()
        }

        setValue(name: string, value: any) {
            this.setState(prevState => {
                return dive(name, value, prevState)
            })
        }

        setValues(values: Dict<any>) {
            this.setState(prevState => {
                let newState = {...prevState}
                Object.entries(values).forEach(([k, v]) => newState = dive(k, v, newState))

                return newState
            })
        }

        reset() {
            this.setState(this.baseData)
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    model={{
                        data: this.state,
                        change: this.change.bind(this),
                        setValue: this.setValue.bind(this),
                        setValues: this.setValues.bind(this),
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


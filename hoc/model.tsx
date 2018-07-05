import * as React from "react";
import { Dict } from "../utility";
import { isObject, isType } from "../utility/assertions";
import { findParentWithClass } from "../utility/dom";


export interface ModelProps<MD extends object = ModelData> {
    readonly model: Model<MD>
}


export interface Model<MD extends object = ModelData> {
    /**
     * Handles data change for a valid form control event and causes a re-render.
     *
     * - The form control must have a name and a value attribute.
     */
    change(changed: ModelChange): Return

    /**
     * Adds one or more name/value pairs to model's data.
     */
    value(values: MD | ModelData): Return

    /**
     * Resets the model data. If any base data has been provided it will be set
     * to the values or they will be emptied otherwise. Causes a re-render.
     */
    reset(): Return
    /**
     * Sets the base model data to the passed data object, overwriting any previous
     * data or creating a shallow merge of the existing base data and the new data
     * if merge is True and then resets the Model's data and causes a re-render.
     */
    reset(data?: MD | ModelData, merge?: boolean): Return

    /**
     * Whether the model data has changed.
     */
    hasChanged(): boolean

    /**
     * Readable Model data. Use methods to set changes to this data.
     */
    readonly data: MD
}

// Don't allow non-primitive type values in model data without making sure that
// they can be scanned properly for change.
type ModelData = Dict<string>
type Return = void | Promise<void>
type ChangeElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
type ChangeEvent = React.ChangeEvent<ChangeElement>
type ModelChange = ChangeEvent | ChangeElement


/**
 * Enhances a component with model serialization. See ModelProps for more info.
 * @param WrappedComponent The component to be wrapped.
 */
function CreateModel<OP extends {}, MD extends object = ModelData>(
    WrappedComponent: React.ComponentType<OP & ModelProps<MD>>
): React.ComponentType<OP> {

    class withModel extends React.Component<OP, ModelData> {
        static displayName: string

        state = {} as ModelData
        baseData = {} as ModelData
        _changed = false

        componentDidUpdate() {
            this._changed = false
        }

        change = async (changed: ModelChange) => {
            const element = isObject(changed, Element) ? changed : changed.target
            let name = element.name
            let value = element.value

            if(isType<HTMLInputElement>(element, () => element.type === "checkbox" || element.type === "radio")) {
                const parentSelect = findParentWithClass(element, "l_select")
                // TODO: React | Model for multiple Select.
                if(parentSelect)
                    name = parentSelect.dataset["name"] || ""
                value = element.checked ? value : ""
            }
            else if(isObject(element, HTMLSelectElement) && element.multiple) {
                value = Object.values(element.options)
                    .filter(o => o.selected)
                    .map(o => o.value).join(",")
            }

            return this.value({
                [name]: value
            })
        }

        value = async(values: ModelData) => {
            this.setState(prevState => {
                this._checkChange(prevState, values)
                return values
            })
        }

        reset = async (data?: ModelData, merge?: boolean) => {
            if(data)
                this.baseData = merge ? {...this.baseData, ...data} : {...data}

            this.setState(prevState => {
                let nextState: ModelData = {}
                Object.keys(prevState).forEach(key => {
                    nextState[key] = ""
                })

                nextState = {...nextState, ...this.baseData}
                this._checkChange(prevState, nextState)
                return nextState
            })
        }

        hasChanged = () => {
            return this._changed
        }

        _checkChange = (current: ModelData, incoming: ModelData) => {
            // Avoid checking multiple times on batch calls if already marked as changed.
            if(!this._changed) {
                const keys = Object.keys(incoming)
                this._changed = (keys.length > 0) && !keys.every(k => incoming[k] === current[k])
            }
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
                        hasChanged: this.hasChanged
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


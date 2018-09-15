import * as React from "react";
import { Dict } from "../utility";
import { isObject } from "../utility/assertions";
import { ParseableElement, parseElement } from "../utility/dom";
import { getDisplayName } from "../utility/react";


export interface ModelProps<MD extends object = ModelData> {
    readonly model: Model<MD>
}


export interface Model<MD extends object = ModelData> {
    /**
     * Handles data change for a valid form control event and causes a re-render.
     *
     * - The form control must have a name and a value attribute.
     */
    change(changed: ModelChange): {name: string, value: ModelDataType}

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
type ModelDataType = string
export type ModelData = Dict<ModelDataType>
type Return = void
export type ModelChangeElement = ParseableElement
export type ModelChangeEvent = React.SyntheticEvent<ModelChangeElement>
export type ModelChange = ModelChangeEvent | ModelChangeElement


/**
 * Enhances a component with model serialization. See ModelProps for more info.
 * @param WrappedComponent The component to be wrapped.
 */
function model<OP extends {}, MD extends object = ModelData>(
    WrappedComponent: React.ComponentType<OP & ModelProps<MD>>
): React.ComponentType<OP> {

    return class extends React.Component<OP, ModelData> {
        static displayName = getDisplayName('Model', WrappedComponent)

        state = {} as ModelData
        baseData = {} as ModelData
        _changed = false

        componentDidUpdate() {
            this._changed = false
        }

        change = (changed: ModelChange) => {
            const element = isObject(changed, Element) ? changed : changed.target as ModelChangeElement
            const parsed = parseElement(element)

            this.value({
                [parsed.name]: parsed.value
            })

            return {...parsed}
        }

        value = (values: ModelData) => {
            this.setState(prevState => {
                this._checkChange(prevState, values)
                return values
            })
        }

        reset = (data: ModelData = {}, merge: boolean = false) => {
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
            if(!this._changed)
                this._changed = !Object.keys(incoming).every(k => incoming[k] === current[k])
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
}


export { model };


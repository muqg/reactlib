import * as React from "react";
import { StringDict } from "../utility";
import { isObject } from "../utility/assertions";
import { dive } from "../utility/collection";
import { findParentWithClass } from "../utility/dom";


export interface ModelProps<MD extends object = StringDict<any>> {
    readonly model: Model<MD>
}


interface Model<MD extends object = StringDict<any>> {
    /**
     * Handles data change for a valid form control event and causes a re-render.
     */
    change(event: ChangeEvent): void

    /**
     * Sets the base model data to the passed object, overwriting any previous
     * data. Calls the reset method of the model and thus causes a re-render.
     */
    setBaseData(base: MD): void

    /**
     * Sets a model value and causes a re-render.
     */
    setValue(name: string, value: any): void

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

        setBaseData(baseData: Model["data"]) {
            this.baseData = {...baseData}
            this.reset()
        }

        setValue(name: string, value: any) {
            this.setState(prevState => {
                return dive(name, value, prevState)
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


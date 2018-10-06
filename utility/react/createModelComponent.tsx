import * as React from "react";
import { Dict } from "..";
import { isString } from "../assertions";
import { createModel, CreateModelOptions } from "../dom/createModel";


interface Props {
    children: JSX.Element
    /**
     * The name of the key within the modelled state.
     */
    name: string
}

/**
 *
 * @param component The component to model the state of.
 * @param key A nested state model key using "dot notation" or an existing instance
 * of a model function.
 * @param options Model options.
 */
function createModelComponent(component: React.Component, key: string | ReturnType<typeof createModel> = "", options: CreateModelOptions = {}): React.SFC<Props> {
    const model = isString(key) ? createModel(component, key, options) : key

    return function Model(props: Props) {
        const state = component.state as Dict<any>

        return React.cloneElement(props.children, {
            name: props.name,
            onChange: model,
            value: state[props.name]
        })
    }
}


export { createModelComponent };


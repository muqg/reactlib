import * as React from "react";
import { pull } from "../collection";
import { createModel } from "../dom/createModel";


interface Props {
    children: JSX.Element
    /**
     * The name of the key within the modelled state.
     */
    name: string
}

interface CreateModelComponentOptions {
    model?: ReturnType<typeof createModel>
}


/**
 *
 * @param component The component to model the state of.
 * @param key A nested state model key using "dot notation" or an existing instance
 * of a model function.
 * @param options Model options.
 */
function createModelComponent(component: React.Component, key = "", {model, ...options}: CreateModelComponentOptions = {}): React.SFC<Props> {
    if(!model)
        model = createModel(component, key, options)

    return function Model(props: Props) {
        return React.cloneElement(props.children, {
            name: props.name,
            onChange: model,
            value: pull(key ? `${key}.${props.name}` : props.name, component.state)
        })
    }
}


export { createModelComponent };


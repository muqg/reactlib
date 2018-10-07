import * as React from "react";
import { isFunction } from "../assertions";
import { pull } from "../collection";
import { createModel } from "../dom/createModel";


interface Props {
    children: JSX.Element | ((props: InjectedModelProps) => JSX.Element)
    /**
     * The name of the key within the modelled state.
     */
    name?: string
}

interface CreateModelComponentOptions {
    model?: ReturnType<typeof createModel>
}

interface InjectedModelProps {
    name: string
    onChange: ReturnType<typeof createModel>
    value: string | number | boolean
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

    return function Model({name = "", ...props}: Props) {
        const injectedProps: InjectedModelProps = {
            name,
            onChange: model!,
            value: name ? pull(key ? `${key}.${name}` : name, component.state) : ""
        }

        if(isFunction<(props: InjectedModelProps) => JSX.Element>(props.children))
            return props.children(injectedProps)
        return React.cloneElement(props.children, injectedProps)
    }
}


export { createModelComponent };

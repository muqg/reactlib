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
 * Creates a higher-order component that injects modelling props to its child
 * component and thus models its changes to a state key.
 * @param component The component to model the state of.
 * @param key A nested state key using "dot notation".
 * @param options Model options.
 */
function createModelComponent(component: React.Component, key = "", {model, ...options}: CreateModelComponentOptions = {}): React.SFC<Props> {
    if (__DEV__) {
        console.warn("`createModelComponent` is deprecated. Consider using useModel hook instead.")
    }

    if(!model)
        model = createModel(component, key, options)

    return function Model({name = "", ...props}: Props) {
        const injectedProps: InjectedModelProps = {
            name,
            onChange: model!,
            value: name ? pull(component.state, key ? `${key}.${name}` : name) : ""
        }

        if(isFunction<(props: InjectedModelProps) => JSX.Element>(props.children))
            return props.children(injectedProps)
        return React.cloneElement(props.children, injectedProps)
    }
}


export { createModelComponent };


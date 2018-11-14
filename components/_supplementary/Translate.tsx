import { useContext } from "react";
import { TranslationContext } from "../../contexts";
import { __translate, __TranslateOptions } from "../../__internal/__translate";

interface Props<T> extends __TranslateOptions {
    /**
     * A function that may perform any final format on the text
     * or even wrap it inside JSX.
     */
    children?: (text: T) => any
    /**
     * The key to retrieve text for.
     */
    value: string
}


export const Translate = <T extends any = string>({children, value, ...options}: Props<T>) => {
    const translations = useContext(TranslationContext)

    const result = __translate<T>(translations, value, options)

    return children ? children(result) : result
}

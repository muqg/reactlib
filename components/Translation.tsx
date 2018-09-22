import * as React from "react";
import { Dict } from "../utility";
import { isArray, isUndefined } from "../utility/assertions";
import { pull } from "../utility/collection";
import { format, plural } from "../utility/string";
import { FormatArgument } from "../utility/string/format";


export const Translation = React.createContext({} as Dict<any>)


interface Props<T> {
    /**
     * Arguments to format the text with.
     */
    args?: Dict<FormatArgument> | FormatArgument[]
    /**
     * A function that may perform any final format on the text
     * or even wrap it inside JSX.
     */
    children?: (text: T) => React.ReactNode
    /**
     * The number to be used when pluralizing the text. Pluralization format
     * inside the text is singular|plural. It is performed after formatting,
     * which allows for dynamic inclusion of pluralizable text.
     */
    count?: number
    /**
     * The key to retrieve text for.
     */
    value: string
}


export const Translate = <T extends any= string>({args, children, count, value}: Props<T>) => (
    <Translation.Consumer>
        {(source) => {
            let text = pull(value, source) || value

            if(text === value)
                console.error("No translation value found for key: " + value)

            if(args) {
                if(isArray(args))
                    text = format(text, ...args)
                else
                    text = format(text, args)
            }

            if(!isUndefined(count))
                text = plural(text, count)

            if(children)
                return children(text)
            return text
        }}
    </Translation.Consumer>
)

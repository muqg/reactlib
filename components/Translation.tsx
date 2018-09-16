import * as React from "react";
import { Dict } from "../utility";
import { isArray } from "../utility/assertions";
import { pull } from "../utility/collection";
import { format, plural } from "../utility/string";
import { FormatArgument } from "../utility/string/format";


export const Translation = React.createContext({} as Dict<any>)


interface Props {
    /**
     * Arguments to format the text with.
     */
    args?: Dict<FormatArgument> | FormatArgument[]
    /**
     * The number to be used when pluralizing the text. Pluralization format
     * inside the text is singular|plural. It is performed after formatting,
     * which allows for dynamic inclusion of pluralizable text.
     */
    count?: number
    /**
     * A function that may perform any final format on the text
     * or even wrap it inside JSX.
     */
    middleware?: (text: string) => string | JSX.Element
    /**
     * The key to retrieve text for.
     */
    value: string
}


export const Translate = ({args, count, value, middleware}: Props) => (
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

            if(count)
                text = plural(text, count)

            return middleware ? middleware(text) : text
        }}
    </Translation.Consumer>
)

import * as React from "react";
import { Dict } from "../utility";
import { isArray } from "../utility/assertions";
import { dig } from "../utility/collection";
import { format, plural } from "../utility/string";
import { FormatArgument } from "../utility/string/format";


const TranslatorContext = React.createContext({} as Dict<any>)
export const Translator = TranslatorContext.Provider


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
     * The key to retrieve text for.
     */
    key: string
    /**
     * A function that may perform any final format on the text
     * or even wrap it inside JSX.
     */
    middleware?: (text: string) => string | JSX.Element
}


export const Translation = ({args, count, key, middleware}: Props) => (
    <TranslatorContext.Consumer>
        {(src) => {
            let text = dig(key, src)

            if(text === key)
                console.error("No translation value found for key: " + key)

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
    </TranslatorContext.Consumer>
)

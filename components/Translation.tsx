import * as React from "react";
import { Dict } from "../utility";
import { isArray } from "../utility/assertions";
import { dig } from "../utility/collection";
import { format, plural } from "../utility/string";
import { FormatArgument } from "../utility/string/format";


const TranslatorContext = React.createContext({} as Dict<any>)

TranslatorContext.Provider.displayName = "Translator"
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
     * A function that may perform any final format on the text
     * or even wrap it inside JSX.
     */
    middleware?: (text: string) => string | JSX.Element
    /**
     * The key to retrieve text for.
     */
    value: string
}


export const Translation = ({args, count, value, middleware}: Props) => (
    <TranslatorContext.Consumer>
        {(source) => {
            let text = dig(value, source) || value

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
    </TranslatorContext.Consumer>
)

import { useCallback, useContext } from "react";
import { TranslationContext } from "../contexts";
import { Dict } from "../utility";
import { isArray, isString, isUndefined } from "../utility/assertions";
import { pull } from "../utility/collection";
import { format, FormatArgument, plural } from "../utility/string";

interface Options {
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
}

function useTranslation() {
    const translations = useContext(TranslationContext)

    function translate<T extends any = string>(key: string, options: Options): T {
        let result = pull(translations, key) || key

        if(result === key)
            console.error("No translation value found for key: " + key)

        if(isString(result)) {
            if(options.args) {
                if(isArray(options.args))
                    result = format(result, ...options.args)
                else
                    result = format(result, options.args)
            }

            if(!isUndefined(options.count))
                result = plural(result, options.count)
        }

        return result
    }

    return useCallback(translate, [translations])
}

export { useTranslation };


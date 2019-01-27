import { useContext } from "react";
import { TranslationContext } from "../contexts";
import { translate, TranslateOptions } from "../__internal__/translate";

/**
 * Returns a translator function.
 *
 * @param baseKey The base key to translate from. It is prepended to the key
 * passed to the returned translate function and can use "dot notation".
 */
function useTranslation(baseKey = "") {
    const translations = useContext(TranslationContext)

    return <T extends any = string>(key: string, options = {} as TranslateOptions) => (
        translate<T>(translations, (baseKey ? `${baseKey}.${key}` : key), options)
    )
}

export { useTranslation };


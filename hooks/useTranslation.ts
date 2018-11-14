import { useCallback, useContext } from "react";
import { TranslationContext } from "../contexts";
import { __translate, __TranslateOptions } from "../__internal/__translate";

/**
 * Returns a translator function.
 *
 * @param baseKey The base key to translate from. It is prepended to the key
 * passed to the returned translate function and can use "dot notation".
 */
function useTranslation(baseKey = "") {
    const translations = useContext(TranslationContext)

    // TODO: Test if callback is truly cached.
    return useCallback(
        <T extends any = string>(key: string, options = {} as __TranslateOptions) => (
            __translate<T>(translations, (baseKey ? `${baseKey}.${key}` : key), options)
        ),
        [translations, baseKey]
    )
}

export { useTranslation };


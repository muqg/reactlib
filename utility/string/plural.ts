const PLURALIZATION_PATTERN = /([\S]+)\|([\S]+)/gi

/**
 * Pluralizes a string if count is not equal to 1. Pluralization pairs are in
 * the following format: singular|plural.
 * @param input The string to be pluralized.
 * @param count The pluralization count.
 */
function plural(str: string, count: number) {
    return str.replace(PLURALIZATION_PATTERN, (_m, singular, plural) =>
        count === 1 ? singular : plural
    )
}

export {plural}

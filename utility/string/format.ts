import { isObject } from "../assertions";
import { Dict } from "../type";

const FORMAT_PATTERN = /{(\d+|\w+)}/gi

export type FormatArgument = string | number | boolean

/**
 * Formats a string by replacing valid placeholders with provided values.
 * @param str The string subject to replace in.
 * @param args A variable number of arguments which are used to replace positional
 * value placeholders.
 */
function format(str: string, ...args: FormatArgument[]): string
/**
 * Formats a string by replacing valid placeholders with provided values.
 * @param str The string subject to replace in.
 * @param args An object of keys and values to use to replace named value
 * placeholders.
 */
function format(str: string, args: Dict<FormatArgument>): string

function format(str: string, ...args: any[]): string {
    const values = isObject(args[0]) ? args[0] : args
    return str.replace(FORMAT_PATTERN,
        (match, val) => values[val] || match
    )
}

export { format };

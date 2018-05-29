import { Color } from "../interfaces";

/**
 * Converts a 6 or 7-digit hexadecimal to its RGB color representation.
 * @param hexColor Hexadecimal representation of the RGB color.
 */
function rgbColor(hexColor: string) : Color {
    hexColor = hexColor.replace("#", "").substring(0, 6)
    const parsed = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    const result: Color = { red: 0, green: 0, blue: 0, alpha: 1}

    if(parsed) {
        result.red = parseInt(parsed[1], 16)
        result.green = parseInt(parsed[2], 16)
        result.blue = parseInt(parsed[3], 16)
    }

    return result
}

export default rgbColor

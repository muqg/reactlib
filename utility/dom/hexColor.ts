import { clamp } from "../number";

/**
 * Converts an RGB color to its hexadecimal representation.
 * @param red Red color value.
 * @param green Green color value.
 * @param blue Blue color value.
 */
function hexColor(red: number, green: number, blue: number) {
    red = clamp(red, 0, 255)
    green = clamp(green, 0, 255)
    blue = clamp(blue, 0, 255)

    return "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
}


export default hexColor

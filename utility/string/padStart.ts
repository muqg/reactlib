/**
 * Pads the start of a string with another string until the desired
 * length is reached.
 *
 * @param str The string to be padded.
 * @param targetLength The length to pad until. By default it is length+1.
 * @param padString The string to pad with. By default it is "0".
 */
function padStart(str: string , targetLength?: number, padString: string = "0"): string {
    const iterations = (targetLength || str.length + 1) - str.length
    let pad = ""

    for(let i = 0; i < iterations; i++)
        pad += padString

    return pad + str
}

export { padStart }

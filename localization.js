import {getElement, formatString} from "./utility"

const jsonLocale = document.getElementById("jsonLocale")
let locale = []
if(jsonLocale)
    locale = JSON.parse(jsonLocale.textContent)
else
    console.warn("JSON locale element not found and cannot initialize localization.")

function localize(key, ...args) {
    const split = key.split("/")
    let result = getElement(key, locale)

    if(result === null)
        console.warn("Invalid localization key: " + key)
    else if(args)
        result = formatString(result, ...args)

    return result
}

export default localize
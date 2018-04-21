

document.addEventListener("click", function(e) {
    const focusedElement = document.querySelector("." + StyleClass.Focused)
    if(focusedElement) {
        focusedElement.classList.remove(StyleClass.Focused)
        focusedElement.dispatchEvent(new Event("unfocused"))
    }

    let targetElement = findGuiParent(e.target)
    targetElement = targetElement ? targetElement : e.target

    targetElement.classList.add(StyleClass.Focused)
    targetElement.dispatchEvent(new Event("focused"))
})



export function findGuiParent(element) {
    const parent = element.parentNode
    if(parent) {
        if(parent.className && parent.className.indexOf("l_gui_") >= 0)
            return parent
        else
            return findGuiParent(parent)
    }
    return null
}

export const ClassName = Object.freeze({
    "Select": "l_gui_select",
    "Checkbox": "l_gui_checkbox",
    "Button": "l_gui_button",
    "Close": "l_gui_close",
    "Input": "l_gui_input",
    "ProgressBar": "l_gui_progressbar",
})

export const StyleClass = Object.freeze({
    Active: "active",
    Checked: "checked",
    Disabled: "disabled",
    Multiple: "multiple",
    Focused: "focused",
})

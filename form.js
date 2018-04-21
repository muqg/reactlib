const ATTR_REF = {
    val: "value",
    text: "textContent",
    html: "innerHTML"
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Functions should support all custom gui elements.
// Serializes data-srlz-(val|text|html|select|checked|attr)
export function serialize(container) {
    var serializedData = {}

    getData("val")
    getData("text")
    getData("html")

    const selects = container.querySelectorAll("[data-srlz-select]")
    for(let i = 0; i < selects.length; i++) {
        const select = selects[i]
        const checkedElements = select.querySelectorAll(":checked")

        // List of elements' ids (values).
        let checkedValues = []
        for(let num = 0; num < checkedElements.length; num++) {
            const checked = checkedElements[num]
            const id = checked.dataset.id || ""
            if(id)
                checkedValues.push(id)
        }

        serializedData[select.dataset.srlzSelect] = checkedValues.join("|")
    }

    const checkboxes = container.querySelectorAll("[data-srlz-checked]")
    for(let i = 0; i < checkboxes.length; i++) {
        const currentCheckbox = checkboxes[i]
        serializedData[currentCheckbox.dataset.srlzChecked]
            = currentCheckbox.checked ? 1 : 0
    }

    const attrElements = container.querySelectorAll("[data-srlz-attr]")
    for(let i = 0; i < attrElements.length; i++) {
        const currentElement = attrElements[i]
        const attrPair = currentElement.dataset.srlzAttr.split("=")

        if(attrPair.length = 2)
            serializedData[attrPair[0]] = currentElement.attrPair[1] || ""
        else
            console.warn("Invalid srlz attribute for element: " + currentElement)
    }

    return serializedData


    function getData(dataName) {
        const elements = container.querySelectorAll("[data-srlz-" + dataName + "]")
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i]
            serializedData[element.dataset["srlz" + ucfirst(dataName)]]
                = element[ATTR_REF[dataName]]
        }
    }
}

export function deserialize(container, data) {

    fill("val")
    fill("text")
    fill("html")

    const selects = container.querySelectorAll("[data-srlz-select]")
    for(let i = 0; i < selects.length; i++) {
        const select = selects[i]
        const dataValue = data[select.dataset.srlzSelect]
        if(dataValue) {
            const idValues = dataValue.split("|")
            for(let num = 0; num < idValues.length; num++) {
                if(idValues[num]) {
                    const target = select.querySelector("[data-id='" + idValues[num] + "']")
                    if(target) {
                        console.log(target)
                        target.dispatchEvent(new Event("click"))
                        target.checked = true
                    }
                }
            }
        }
    }

    const checkboxes = container.querySelectorAll("[data-srlz-checked]")
    for(let i = 0; i < checkboxes.length; i++) {
        const currentCheckbox = checkboxes[i]
        if(data[currentCheckbox.dataset.srlzChecked] == 1)
            currentCheckbox.dispatchEvent(new Event("click"))
    }

    const attrElements = container.querySelectorAll("[data-srlz-attr]")
    for(let i = 0; i < attrElements.length; i++) {
        const currentElement = attrElements[i]
        const attrPair = currentElement.dataset.srlzAttr.split("=")

        if(attrPair.length = 2)
            currentElement.setAttribute(attrPair[1], data[attrPair[0]] || "")
        else
            console.warn("Invalid srlz attribute for element: " + currentElement[0])
    }

    function fill(dataName) {
        const elements = container.querySelectorAll("[data-srlz-" + dataName + "]")
        for(let i = 0; i < elements.length; i++) {
            const element = elements[i]
            const datasetValue = element.dataset["srlz" + ucfirst(dataName)]
            const dataValue = data[datasetValue] || ""
            element[ATTR_REF[dataName]] = dataValue
        }
    }
}

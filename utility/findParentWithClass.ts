/*
DEPRECATED | lub:
Not needed to be used.
*/

const findParentWithClass = (element, classname: string) => {
    const parent = element.parentNode
    if(parent && parent.nodeName !== "HTML") {
        if(parent.classList && parent.classList.contains(classname))
            return parent
        else
            return findParentWithClass(parent, classname)
    }
    return null
}


export default findParentWithClass

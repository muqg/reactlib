/**
 * Returns a HOC display name.
 * @param component The component being improved.
 */
function getDisplayName(
    wrapperName: string,
    wrappedComponent: React.ComponentType<any>
) {
    return `${wrapperName}(${wrappedComponent.displayName ||
        wrappedComponent.name ||
        "component"})`
}

export {getDisplayName}

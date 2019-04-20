global.__DEV__ = "development"

if (document !== undefined) {
    document.execCommand = () => {}
}

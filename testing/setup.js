global.__DEV__ = false

if (document !== undefined) {
    document.execCommand = () => {}
}

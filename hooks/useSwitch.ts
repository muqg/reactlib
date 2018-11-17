import { useCallback, useState } from "react";

/**
 * Creates a boolean switch with memoized callbacks for its manipulation.
 *
 * @param initialValue The initial state value of the switch.
 */
function useSwitch(initialValue = false) {
    const [enabled, setEnabled] = useState(initialValue)

    const toggle = useCallback(() => setEnabled(!enabled), [enabled])
    const enable = useCallback(() => setEnabled(true), [])
    const disable = useCallback(() => setEnabled(false), [])

    return {isOn: enabled, toggle, enable, disable}
}

export { useSwitch };


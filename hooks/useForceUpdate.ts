import { useState } from "react";

/**
 * Returns a function which may be used to force a
 * component update at any given time.
 */
function useForceUpdate() {
    return useState(0)[1] as (() => void)
}

export { useForceUpdate };


import { useRef } from "react";

function useInitialRender() {
    const ref = useRef(true)
    const initialRender = ref.current

    ref.current = false

    return initialRender
}

export { useInitialRender };


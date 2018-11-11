import { useEffect } from "react";
import { Hotkey, isKeyPressed } from "../utility/dom";


function useGlobalHotkey(hotkey: Hotkey, handle: (event: KeyboardEvent) => any, allowInsideInputs?: boolean) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if(isKeyPressed(hotkey, event, allowInsideInputs))
                handle(event)
        }

        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [handle])
}


export { useGlobalHotkey };


import * as React from "react";
import { useRef, useState } from "react";
import { COLOR_PRIMARY_LIGHT, styled } from "../../styles";
import { CHAR_CODE_ENTER, Editor, isKeyPressed } from "../../utility/dom";
import { call } from "../../utility/function";


const Container = styled.div`
    border: ${COLOR_PRIMARY_LIGHT} 1px solid;
    box-sizing: border-box;
    min-height: 2.7em;
    outline: none;
    overflow: auto;
    padding: 5px;
`

interface Props {
    className?: string
    content?: string
    contentChange?: (content: string) => void
    preventNewline?: boolean
}


const EditableContainer = (props: Props) => {
    // Keep content as state variable in order to
    // only initially set it based on props.
    const [content] = useState(props.content)
    const containerRef = useRef<any>(null)

    function handleChange() {
        Editor.saveSelection()

        const container = containerRef.current
        if(container)
            call(props.contentChange, container.innerHTML)
    }

    function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
        event.preventDefault()

        const text = event.clipboardData.getData("text/plain")
        Editor.insertHTML(text)
    }

    function preventNewline(event: React.KeyboardEvent) {
        if(isKeyPressed({keyCode: CHAR_CODE_ENTER}, event, true))
            event.preventDefault()
    }

    return (
        <Container
            className={props.className}
            contentEditable

            onBlur={handleChange}
            onKeyPress={props.preventNewline ? preventNewline : undefined}
            onInput={handleChange}
            onPaste={handlePaste}

            ref={containerRef}
            spellCheck={false}

            dangerouslySetInnerHTML={{__html: content || ""}}
        />
    )
}


export { EditableContainer };


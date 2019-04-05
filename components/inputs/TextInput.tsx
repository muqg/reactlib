import * as React from "react"
import {useState} from "react"
import {ModelError} from "../../hooks"
import {
    COLOR_ACCENT,
    COLOR_DARK,
    COLOR_ERROR,
    COLOR_TEXT,
    styled,
} from "../../styles"
import {Omit} from "../../utility"
import {call} from "../../utility/function"

interface StyleProps {
    hasError?: boolean
    type?: "number" | "password" | "text"
    /**
     * Whether to attempt to fill the container's width.
     *
     * - Sets width to 100%
     */
    wide?: boolean
}

const StyledInput = styled.input`
    border: 1px solid
        ${p =>
            p.hasError
                ? p.theme.error || COLOR_ERROR
                : p.theme.main || COLOR_DARK};
    color: ${p => p.theme.text || COLOR_TEXT};
    cursor: text;
    min-width: 250px;
    padding: 6px 9px;
    transition: all 0.1s ease;

    ${(p: StyleProps) => p.wide && `width: 100%;`}

    &:focus {
        border-color: ${p => p.theme.accent || COLOR_ACCENT};
        box-shadow: inset 0 0 4px ${p => p.theme.accent || COLOR_ACCENT};
    }

    &:disabled {
        cursor: default;
    }
`

interface OwnProps {
    error?: ModelError
}

type Props = OwnProps &
    Omit<React.ComponentProps<typeof StyledInput>, "hasError">

function TextInput({error, onBlur, ...props}: Props) {
    const [hasError, setHasError] = useState(false)

    function checkForError(e: React.FocusEvent<HTMLInputElement>) {
        call(onBlur, e)
        setHasError(!!error)
    }

    return <StyledInput {...props} hasError={hasError} onBlur={checkForError} />
}

export {TextInput}

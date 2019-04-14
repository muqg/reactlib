import {
    COLOR_ACCENT,
    COLOR_DARK,
    COLOR_ERROR,
    COLOR_TEXT,
    styled,
} from "../../styles"
import {ValidationError} from "../../utility"

interface StyleProps {
    error?: ValidationError
    type?: "number" | "password" | "text"
    /**
     * Whether to attempt to fill the container's width.
     *
     * - Sets width to 100%
     */
    wide?: boolean
}

const TextInput = styled.input`
    border: 1px solid
        ${p =>
            p.error
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
TextInput.displayName = "TextInput"

export {TextInput}

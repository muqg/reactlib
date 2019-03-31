import * as React from "react"
import {useContext} from "react"
import {COLOR_TEXT, styled, ThemeContext} from "../../styles"
import {TextInput} from "./TextInput"

const StyledLabel = styled.label`
    position: relative;
`
const StyledSvg = styled.svg`
    height: 1.5em;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
`

function SearchInput({
    color,
    ...props
}: React.ComponentProps<typeof TextInput>) {
    const theme = useContext(ThemeContext)
    color = color || theme.text || COLOR_TEXT

    return (
        <StyledLabel>
            <TextInput {...props} color={color} />
            <StyledSvg viewBox="0 0 24 24" focusable="false" fill={color}>
                <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16
                    9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
            </StyledSvg>
        </StyledLabel>
    )
}

export {SearchInput}

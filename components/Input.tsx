import * as React from "react"
import { styled, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT } from "../styles";


const StyledInput = styled.input`
    background: transparent;
    border: none;
    border-bottom: 2px solid ${COLOR_PRIMARY_LIGHT};
    outline: none;
    padding: 2px;
    transition: border .25s;
    width: ${(p: Props) => p.width};

    &:focus {
        border-bottom-color: ${COLOR_PRIMARY_DARK};
    }
`
StyledInput.defaultProps = {
    width: "250px"
}

interface Props {
    placeholder?: string
    width?: string
}


const Input = (props: Props) => {
    return(
        <StyledInput {...props} />
    )
}


export { Input }

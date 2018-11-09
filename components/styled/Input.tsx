import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, styled } from "../../styles";


const Input = styled.input`
    background: transparent;
    border: none;
    border-bottom: 2px solid ${COLOR_PRIMARY_LIGHT};
    outline: none;
    padding: 2px;
    transition: border .25s;
    width: ${(p: StyleProps) => p.width};

    &:focus {
        border-bottom-color: ${COLOR_PRIMARY_DARK};
    }
`
Input.defaultProps = {
    width: "250px"
}

interface StyleProps {
    width?: string
}


export { Input };

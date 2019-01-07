import { COLOR_DARK, COLOR_MAIN, styled } from "../../styles";


const Input = styled.input`
    background: transparent;
    border: none;
    border-bottom: 2px solid ${COLOR_MAIN};
    outline: none;
    padding: 2px;
    transition: border .25s;
    width: ${(p: StyleProps) => p.width};

    &:focus {
        border-bottom-color: ${COLOR_DARK};
    }
`
Input.defaultProps = {
    width: "250px"
}

interface StyleProps {
    width?: string
}


export { Input };

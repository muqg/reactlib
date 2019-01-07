import { COLOR_DARK, COLOR_MAIN, styled } from "../../styles";


const Button = styled.button`
    background: ${(p: StyleProps) => p.background};
	border-radius: 3px;
	color: ${p => p.color};
    cursor: pointer;
    display: inline-block;
	font-weight: bold;
    margin: ${p => p.margin};
	padding: 6px 12px;
	transition: .1s;
	transition-property: background, color, transform;

    &:hover {
        background: ${p => p.hoverBackground};
		color: ${p => p.hoverColor};
    }
`
Button.defaultProps = {
    background: COLOR_DARK,
    color: COLOR_MAIN,
    hoverBackground: "#aaa",
    hoverColor: "#333",
    margin: "0",
}

interface StyleProps {
    background?: string
    color?: string
    hoverBackground?: string
    hoverColor?: string
    margin?: string
}


export { Button };

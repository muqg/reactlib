import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, styled } from "../styles";


const Button = styled.button`
    background: ${(p: StyleProps) => p.background};
	border-radius: 3px;
	color: ${p => p.color};
    cursor: pointer;
	font-weight: bold;
    margin: ${p => p.margin};
    min-height: 28px;
	padding: 6px 12px;
	transition: .1s;
	transition-property: background, color, transform;

    &:hover {
        background: ${p => p.hoverBackground};
		color: ${p => p.hoverColor};
    }
`
Button.defaultProps = {
    background: COLOR_PRIMARY_DARK,
    color: COLOR_PRIMARY_LIGHT,
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

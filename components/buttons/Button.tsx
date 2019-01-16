import { COLOR_CONTRAST, COLOR_DARK, styled, css, fadedColor } from "../../styles";


export const enum ButtonVariant {
    Normal, Outlined, Text
}


interface StyleProps {
    color?: string
    contrastColor?: string
    /**
     * Whether the hover animation is enabled.
     */
    hover?: boolean
    variant?: ButtonVariant
}

const normalStyle = css`
    ${(_p: StyleProps) => ''}

    background: ${p => p.color};
    color: ${p => p.contrastColor};
    fill: ${p => p.contrastColor};
    stroke: ${p => p.contrastColor};

    ${p => p.hover && css`
        &:hover {
            background: transparent;
            border-color: ${p => p.color};
            color: ${p => p.color};
            fill: ${p => p.color};
            stroke: ${p => p.color};
        }
    `}
`

const outlinedStyle = css`
    ${(_p: StyleProps) => ''}

    background: transparent;
    border-color: ${p => p.color};
    color: ${p => p.color};
    fill: ${p => p.color};
    stroke: ${p => p.color};

    ${p => p.hover && css`
        &:hover {
            background: ${p => p.color};
            color: ${p => p.contrastColor};
            fill: ${p => p.contrastColor};
            stroke: ${p => p.contrastColor};
        }
    `}
`

const textStyle = css`
    ${(_p: StyleProps) => ''}

    background: transparent;
    color: ${p => p.color};
    fill: ${p => p.color};
    stroke: ${p => p.color};

    ${p => p.hover && css`
        &:hover {
            /* color is injected via DefaultProps and is never undefined */
            background: ${p => fadedColor(p.color!)};
        }
    `}
`

export const ButtonDefaultProps: StyleProps = {
    color: COLOR_DARK,
    contrastColor: COLOR_CONTRAST,
    hover: true,
    variant: ButtonVariant.Normal
}

const Button = styled.button`
    /* DefaultProps take care of missing props */
    ${(_p: StyleProps) => ''}

    border: 1px solid transparent;
    cursor: pointer;
    display: inline-block;
    font-weight: bold;
    padding: 6px 12px;
    transition: all .15s ease-in-out;

    ${p => p.variant === ButtonVariant.Normal && normalStyle}
    ${p => p.variant === ButtonVariant.Outlined && outlinedStyle}
    ${p => p.variant === ButtonVariant.Text && textStyle}
`
Button.defaultProps = ButtonDefaultProps
Button.displayName = "Button"


export { Button };


import { COLOR_CONTRAST, COLOR_DARK, css, fadedColor, styled } from "../../styles";


export const enum ButtonVariant {
    Normal, Outlined, Text
}


export interface ButtonStyleProps {
    color?: string
    contrastColor?: string
    /**
     * Whether the hover animation is enabled.
     */
    hover?: boolean
    variant?: ButtonVariant
}

const normalStyle = css`
    background: ${(p: ButtonStyleProps) => p.color};
    color: ${p => p.contrastColor};
    fill: ${p => p.contrastColor};
    stroke: ${p => p.contrastColor};

    ${p => p.hover && css`
        &:hover {
            background: transparent;
            border-color: ${(p: ButtonStyleProps) => p.color};
            color: ${p => p.color};
            fill: ${p => p.color};
            stroke: ${p => p.color};
        }
    `}
`

const outlinedStyle = css`
    background: transparent;
    border-color: ${(p: ButtonStyleProps) => p.color};
    color: ${p => p.color};
    fill: ${p => p.color};
    stroke: ${p => p.color};

    ${p => p.hover && css`
        &:hover {
            background: ${(p: ButtonStyleProps) => p.color};
            color: ${p => p.contrastColor};
            fill: ${p => p.contrastColor};
            stroke: ${p => p.contrastColor};
        }
    `}
`

const textStyle = css`
    background: transparent;
    color: ${(p: ButtonStyleProps) => p.color};
    fill: ${p => p.color};
    stroke: ${p => p.color};

    ${p => p.hover && css`
        &:hover {
            /* color is injected via DefaultProps and is never undefined */
            background: ${(p: ButtonStyleProps) => fadedColor(p.color!)};
        }
    `}
`

export const ButtonDefaultProps: ButtonStyleProps = {
    hover: true,
    variant: ButtonVariant.Normal
}

const Button = styled("button").attrs<ButtonStyleProps, ButtonStyleProps>(p => ({
    color: p.color || p.theme.main || COLOR_DARK,
    contrastColor: p.contrastColor || p.theme.contrast || COLOR_CONTRAST,
}))`
    border: 1px solid transparent;
    cursor: pointer;
    display: inline-block;
    font-weight: bold;
    padding: 6px 12px;
    text-align: center;
    transition: all .1s;

    ${p => p.variant === ButtonVariant.Normal && normalStyle}
    ${p => p.variant === ButtonVariant.Outlined && outlinedStyle}
    ${p => p.variant === ButtonVariant.Text && textStyle}
`
Button.defaultProps = ButtonDefaultProps
Button.displayName = "Button"


export { Button };


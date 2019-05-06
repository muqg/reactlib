import * as React from "react"
import {COLOR_BACKGROUND, COLOR_SUCCESS, css, styled} from "../styles"

const Container = styled.label`
    display: inline-block;
    height: 20px;
    width: 40px;

    > input {
        display: none;
    }
`
const Background = styled.span`
    background: #aaa;
    border-radius: 10px;
    display: inline-block;
    height: 100%;
    position: relative;
    transition: all 0.2s;
    width: 100%;

    &:after {
        background: ${p => p.theme.background || COLOR_BACKGROUND};
        border-radius: 50%;
        box-shadow: 0 0 3px ${p => p.theme.text};
        content: "";
        height: 110%;
        left: 0;
        position: absolute;
        top: -5%;
        transition: all 0.2s;
        width: 55%;
    }

    ${(p: StyleProps) =>
        p.disabled
            ? css`
                  opacity: 0.3;
              `
            : css`
                  &:active:after {
                      width: 65%;
                  }

                  input:checked ~ & {
                      background: ${p => p.theme.success || COLOR_SUCCESS};
                  }

                  input:checked ~ &:after {
                      left: 45%;
                  }

                  input:checked ~ &:active:after {
                      left: 35%;
                  }
              `}
`

interface StyleProps {
    disabled?: boolean
}

interface Props {
    checked?: boolean
    className?: string
    disabled?: boolean
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Switch = (props: Props) => {
    return (
        <Container className={props.className}>
            <input {...props} type="checkbox" />
            <Background />
        </Container>
    )
}

export {Switch}

import * as React from "react";
import { COLOR_GREEN, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, COLOR_WHITE, css, styled } from "../styles";
import { positionMixin } from "../styles/mixins";

const BORDER_RADIUS_VALUE = "3px"

const Container = styled.label`
    border: 1px solid ${COLOR_PRIMARY_DARK};
    border-radius: ${BORDER_RADIUS_VALUE};
    cursor: pointer;
    display: inline-block;
    height: 19px;
    width: 45px;

    > input {
        display: none;
    }
`

const Background = styled.span`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: ${BORDER_RADIUS_VALUE};
    display: inline-block;
    height: 100%;
    transition-duration: .25s;
    transition-property: background, opacity;
    width: 100%;
    ${positionMixin("relative")}

    &:after {
        background: ${COLOR_WHITE};
        border-radius: ${BORDER_RADIUS_VALUE};
        content: '';
        height: 100%;
        transition: .2s;
        transition-property: left, width;
        width: 17px;
        ${positionMixin("absolute", "0", null, null, "0")}
    }

    ${(p: StyleProps) =>
        p.disabled
        ?
        css`
            opacity: .3;
        `
        :
        css`
            &:active:after {
                width: 22px;
            }

            input:checked ~ & {
                background: ${COLOR_GREEN};
            }

            input:checked ~ &:after {
                left: calc(100% - 17px); /* Subtract marker's width while NOT checked */
            }

            input:checked ~ &:active:after {
                left: calc(100% - 22px); /* Subtract marker's width while checked */
            }
        `
    }

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


const Checkbox = (props: Props) => {
    return(
        <Container className={props.className}>
            <input
                {...props}
                type="checkbox"
            />
            <Background />
        </Container>
    )
}


export { Checkbox };


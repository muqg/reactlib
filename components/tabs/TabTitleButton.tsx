import * as React from "react";
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, css, styled } from "../../styles";
import { truncateMixin } from "../../styles/mixins";


const StyledButton = styled.button`
    border: 1px solid ${COLOR_PRIMARY_LIGHT};
    box-sizing: border-box;
    padding: 4px;
    ${truncateMixin("150px")}

    &:not(:first-child) {
        border-left: none;
    }

    ${p => p.active && css`
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        box-shadow: 0 -3px 4px 0 ${COLOR_PRIMARY_DARK};
        font-weight: bold;
    `}

    ${(_p: StyleProps) => ""}
`

interface StyleProps {
    active: Props["active"]
}
interface Props {
    active?: boolean
    children: React.ReactNode
    index: number
    onClick: (index: number) => void
}


const TabTitleButton = (props: Props) => {
    return (
        <StyledButton
            active={props.active}
            onClick={() => props.onClick(props.index)}
        >
            {props.children}
        </StyledButton>
    )
}


export { TabTitleButton };


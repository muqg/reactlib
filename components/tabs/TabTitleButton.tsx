import * as React from "react";
import { COLOR_DARK, COLOR_MAIN, css, styled } from "../../styles";
import { truncate } from "../../styles/mixins";


const StyledButton = styled.button`
    border: 1px solid ${COLOR_MAIN};
    padding: 4px;
    ${truncate("150px")}

    &:not(:first-child) {
        border-left: none;
    }

    ${p => p.active && css`
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        box-shadow: 0 -3px 4px 0 ${COLOR_DARK};
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


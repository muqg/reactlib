import * as React from "react";
import { COLOR_ACCENT, css, styled } from "../../styles";
import { truncate } from "../../styles/mixins";


interface StyleProps {
    active: Props["active"]
}

const StyledButton = styled.button`
    border-bottom: 4px solid transparent;
    cursor: pointer;
    margin-bottom: -1px;
    padding: 6px;
    ${truncate("150px")}

    ${p => p.active && css`
        border-color: ${COLOR_ACCENT};
        font-weight: bold;
    `}

    ${(_p: StyleProps) => ""}
`


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


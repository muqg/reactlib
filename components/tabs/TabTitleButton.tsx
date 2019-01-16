import * as React from "react";
import { styled } from "../../styles";
import { truncate } from "../../styles/mixins";
import { Button, ButtonVariant } from "../buttons";


const StyledButton = styled(Button)`
    border-radius: 0;
    ${truncate("150px")}
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
            hover={!props.active}
            onClick={() => props.onClick(props.index)}
            variant={props.active ? ButtonVariant.Normal : ButtonVariant.Outlined}
        >
            {props.children}
        </StyledButton>
    )
}


export { TabTitleButton };


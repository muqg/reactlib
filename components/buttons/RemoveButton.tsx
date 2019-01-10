import * as React from "react";
import { COLOR_ERROR } from "../../styles";
import { Omit, Size } from "../../utility";
import { IconButton } from "./IconButton";

// Ref is not assignable to SC 4.0.3
type Props = Omit<React.ComponentProps<typeof IconButton>, "children" | "ref">

const RemoveButton: React.ComponentType<Props> = ({color = COLOR_ERROR, ...props}) => {
    const stroke = props.size && props.size > Size.Medium ? props.size : 2

    return (
        <IconButton {...props} color={color} >
            <svg height="50%" strokeWidth={stroke} width="50%">
                <line x1="0" x2="100%" y1="50%" y2="50%" />
            </svg>
        </IconButton>
    )
}


export { RemoveButton };


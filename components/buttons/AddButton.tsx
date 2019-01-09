import * as React from "react";
import { COLOR_SUCCESS } from "../../styles";
import { Omit, Size } from "../../utility";
import { getIconButtonDiameter, IconButton } from "./IconButton";

// Ref is not assignable to SC 4.0.3
type Props = Omit<React.ComponentProps<typeof IconButton>, "children" | "ref">

function AddButton({color = COLOR_SUCCESS, ...props}: Props) {
    const size = getIconButtonDiameter(props)
    const x1 = size / 4
    const x2 = size - x1
    const y = size / 2
    const stroke = props.size && props.size > Size.Medium ? props.size : 2

    return (
        <IconButton {...props} color={color} >
            <svg
                height={size}
                strokeWidth={stroke}
                viewBox={`1 1 ${size} ${size}`}
                width={size}
            >
                <line x1={x1} x2={x2} y1={y} y2={y} />
                <line x1={y} x2={y} y1={x1} y2={x2} />
            </svg>
        </IconButton>
    )
}


export { AddButton };


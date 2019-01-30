import * as React from "react";
import { useContext } from "react";
import { COLOR_SUCCESS, ThemeContext } from "../../styles";
import { Omit, Size } from "../../utility";
import { IconButton } from "./IconButton";

type Props = Omit<React.ComponentProps<typeof IconButton>, "children">

const AddButton: React.ComponentType<Props> = ({color, ...props}) => {
    const theme = useContext(ThemeContext)
    color = color || theme.success || COLOR_SUCCESS

    const stroke = props.size && props.size > Size.Medium ? props.size : 2

    return (
        <IconButton {...props} color={color} >
            <svg height="50%" strokeWidth={stroke} width="50%">
                <line x1="0" x2="100%" y1="50%" y2="50%" />
                <line x1="50%" x2="50%" y1="0" y2="100%" />
            </svg>
        </IconButton>
    )
}


export { AddButton };


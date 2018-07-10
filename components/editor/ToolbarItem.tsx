import * as React from "react";
import { classNames } from "../../utility/dom";


interface Props {
    children?: any
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    title?: string
}


const ToolbarItem = (props: Props) => {
    const classes = classNames("l_tb_item", props.className)

    return(
        <div className={classes} onClick={props.onClick} title={props.title}>
            {props.children}
        </div>
    )
}


export { ToolbarItem };

import * as React from "react";
import "../../css/tabs.css";
import { classNames } from "../../utility/dom";

interface IProps {
    attributes?: {}
    children?: any
    className?: string
}

const Tab = ({children, className, attributes}: IProps) => (
    <div className={classNames("l_tab", className)} {...attributes}>
        {children}
    </div>
)

export default Tab
import * as React from "react";
import "../../css/tabs.css";

interface IProps {
    attributes?: {}
    children?: any
    className?: string
}

const Tab = ({children, className, attributes}: IProps) => (
    <div className={["l_tab", className].join(" ")} {...attributes}>
        {children}
    </div>
)

export default Tab
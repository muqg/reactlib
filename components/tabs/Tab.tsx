import * as React from "react";


interface Tab {
    children?: React.ReactNode
    className?: string
    /**
     * The text or element to be displayed inside the tab button.
     */
    title: string | (() => React.ReactNode)
}

const Tab: React.StatelessComponent<Tab> = (props: Tab) => {
    return (
        <div className={props.className}>
            {props.children}
        </div>
    )
}


export { Tab };


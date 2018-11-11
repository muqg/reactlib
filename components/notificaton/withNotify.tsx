import * as React from "react";
import { NotificationContext, Notify } from ".";
import { getDisplayName } from "../../utility/react";


function withNotify<T extends {}>(Component: React.ComponentType<T & {notify: Notify}>) {
    const wrapper: React.ComponentType<T> = (props: T) => {
        return (
            <NotificationContext.Consumer>
                {notify => {
                    return <Component {...props} notify={notify} />
                }}
            </NotificationContext.Consumer>
        )
    }

    wrapper.displayName = getDisplayName("withNotify", Component)

    return wrapper
}

export { withNotify };


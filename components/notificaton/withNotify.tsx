import * as React from "react";
import { useContext } from "react";
import { NotificationContext, Notify } from ".";
import { getDisplayName } from "../../utility/react";


function withNotify<T extends {}>(Component: React.ComponentType<T & {notify: Notify}>) {
    const wrapper: React.ComponentType<T> = (props: T) => {
        const notify = useContext(NotificationContext)
        
        return <Component {...props} notify={notify} />
    }

    wrapper.displayName = getDisplayName("withNotify", Component)

    return wrapper
}

export { withNotify };


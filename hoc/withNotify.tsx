import * as React from "react";
import { useContext } from "react";
import { Notify } from "../components/notificaton";
import { NotificationContext } from "../contexts";
import { Omit } from "../utility";
import { getDisplayName } from "../utility/react";

export interface NotificationComponentProps {
    notify: Notify
}

function withNotify<P extends NotificationComponentProps>(
    Component: React.ComponentType<P>
) {
    const wrapper: React.FunctionComponent<Omit<P, keyof NotificationComponentProps>>= (props) => {
        const notify = useContext(NotificationContext)
        // @ts-ignore TS2322: Type 'Pick<P, Exclude<keyof P, "notify">>...
        return <Component {...props} notify={notify} />
    }

    wrapper.displayName = getDisplayName("withNotify", Component)

    return wrapper
}

export { withNotify };


import * as React from "react";
import { NotificationContext, NotificationData, NotificationDataContext, Notify } from "./contexts";
import { Notification } from "./Notification";

interface Props {
}


class Notifiable extends React.Component<Props, NotificationData> {
    state: NotificationData = {
        message: ""
    }

    notify: Notify = (message: string) => {
        this.setState({message})
    }

    render() {
        return (
            <NotificationContext.Provider value={this.notify}>
                <NotificationDataContext.Provider value={this.state}>
                    <Notification {...this.state} />
                    {this.props.children}
                </NotificationDataContext.Provider>
            </NotificationContext.Provider>
        )
    }
}


export { Notifiable };


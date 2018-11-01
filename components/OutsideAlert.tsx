import * as React from "react";
import { Dict } from "../utility";
import { len } from "../utility/collection";
import { remove } from "../utility/collection/remove";
import { randomId } from "../utility/string";

interface Alert {
    enabled: boolean
    trigger: () => void
}


class OutsideAlert extends React.Component<Alert> {
    static defaultProps: Partial<Alert> = {
        enabled: true
    }
    static alerts: Dict<Alert> = {}

    container = React.createRef<HTMLDivElement>()
    index = randomId(4)

    componentDidMount() {
        if(len(OutsideAlert) === 0)
            document.addEventListener("mouseup", this.triggerAlerts)

        OutsideAlert.alerts[this.index] = this.props
    }

    componentDidUpdate() {
        OutsideAlert.alerts[this.index] = this.props
    }

    componentWillUnmount() {
        OutsideAlert.alerts = remove(OutsideAlert.alerts, this.index)

        if(len(OutsideAlert.alerts) === 0)
            document.removeEventListener("mouseup", this.triggerAlerts)
    }

    triggerAlerts = () => {
        Object.values(OutsideAlert.alerts)
              .forEach(alert => alert.enabled && alert.trigger())
    }

    render() {
        return (
            <div ref={this.container}>

            </div>
        )
    }
}


export { OutsideAlert };


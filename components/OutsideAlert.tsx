import * as React from "react";
import { Dict, Omit } from "../utility";
import { except, len, only } from "../utility/collection";


interface Alert {
    container: HTMLDivElement
    /**
     * Whether the alert trigger is enabled.
     */
    enabled: boolean
    /**
     * Callback for when outside alert is triggered.
     */
    trigger: () => any
}

type Props = Omit<Alert, "container">

class OutsideAlert extends React.Component<Props> {
    static defaultProps: Partial<Alert> = {
        enabled: true
    }
    static alerts: Dict<Alert> = {}
    static nextIndex = 0

    container = React.createRef<HTMLDivElement>()
    index = OutsideAlert.nextIndex++

    componentDidMount() {
        if(!len(OutsideAlert.alerts))
            document.addEventListener("mouseup", this.triggerAlerts)

        this._update()
    }

    componentDidUpdate() {
        this._update()
    }

    componentWillUnmount() {
        OutsideAlert.alerts = except(OutsideAlert.alerts, this.index.toString())

        if(!len(OutsideAlert.alerts))
            document.removeEventListener("mouseup", this.triggerAlerts)
    }

    _update() {
        if(!this.container.current)
            return

        OutsideAlert.alerts[this.index] = {
            container: this.container.current,
            ...only(this.props, "enabled", "trigger")
        } as Alert
    }

    triggerAlerts = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        Object.values(OutsideAlert.alerts).forEach(alert => {
            if(alert.enabled && !alert.container.contains(target))
                alert.trigger()
        })
    }

    render() {
        return (
            <div ref={this.container}>
                {this.props.children}
            </div>
        )
    }
}


export { OutsideAlert };


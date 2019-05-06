import * as React from "react"
import {Dict} from "../utility"
import {except, len, only} from "../utility/collection"

interface Alert {
  /**
   * The container that a click outside of which should be alerted.
   */
  container?: HTMLElement
  /**
   * Whether the alert trigger is enabled.
   */
  enabled: boolean
  /**
   * Callback for when outside alert is triggered.
   */
  trigger: () => any
}

type Props = Alert

/**
 * Alerts a container when a click outside of it occurs by calling a trigger
 * callback. If a container prop is not passed then children are wrapped inside
 * a <div> container.
 */
class OutsideAlert extends React.Component<Props> {
  static defaultProps: Partial<Alert> = {
    enabled: true,
  }
  static alerts: Dict<Alert> = {}
  static nextIndex = 0

  container = React.createRef<HTMLDivElement>()
  index = OutsideAlert.nextIndex++

  componentDidMount() {
    if (!len(OutsideAlert.alerts))
      document.addEventListener("mouseup", this.triggerAlerts)

    this._update()
  }

  componentDidUpdate() {
    this._update()
  }

  componentWillUnmount() {
    OutsideAlert.alerts = except(OutsideAlert.alerts, this.index.toString())

    if (!len(OutsideAlert.alerts))
      document.removeEventListener("mouseup", this.triggerAlerts)
  }

  _update() {
    OutsideAlert.alerts[this.index] = {
      container: this.props.container || this.container.current,
      ...only(this.props, "enabled", "trigger"),
    } as Alert
  }

  triggerAlerts = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    Object.values(OutsideAlert.alerts).forEach(alert => {
      if (alert.enabled && alert.container && !alert.container.contains(target))
        alert.trigger()
    })
  }

  render() {
    if (this.props.container) return this.props.children

    return <div ref={this.container}>{this.props.children}</div>
  }
}

export {OutsideAlert}

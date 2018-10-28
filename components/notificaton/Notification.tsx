import * as React from "react";
import { COLOR_BLACK, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, css, styled } from "../../styles";
import { positionMixin } from "../../styles/mixins";
import { delay } from "../../utility";
import { NotificationContext } from "./contexts";


const NOTIFICATION_DURATION = 2_000

const Container = styled.div`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: 3px;
    box-shadow: 0 0 9px -1px ${COLOR_PRIMARY_DARK};
    box-sizing: border-box;
    color: ${COLOR_BLACK};
    cursor: default;
    padding: 12px;
    text-align: center;
    /* Y translate should account for box-shadow and bottom offset. */
    transform: translate(-50%, calc(100% + 15px));
    transition: transform .3s;
    width: 250px;
    z-index: 250;
    ${positionMixin("fixed", "", "", "12px", "50%")}

    ${(p: StyleProps) => p.active && css`
        transform: translateX(-50%);
    `}
`

interface StyleProps {
    active: boolean
}

interface Props {
    message: string
}

interface State {
    isActive: boolean
}

class Notification extends React.PureComponent<Props, State> {
    state: State = {
        isActive: false
    }
    static contextType = NotificationContext
    notify = this.context

    componentDidUpdate(prevProps: Props) {
        if(prevProps.message === this.props.message)
            return

        if(!this.props.message.length) {
            this.setState({isActive: false})
        }
        else {
            this.setState({isActive: true})
            this.hide()
        }
    }

    hide = delay(() => {
        this.notify("")
    }, NOTIFICATION_DURATION)

    render() {
        return (
            <Container active={this.props.message.length > 0}>
                {this.props.message}
            </Container>
        )
    }
}

export { Notification };


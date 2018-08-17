import * as React from "react";
// @ts-ignore
import { connect } from "react-redux";
import { setNotification } from "../actions";
import { ReduxFactory } from "../main";
import { notificationReducer } from "../reducers/notificationReducer";
import { LubState } from "../reducers/types";
import { COLOR_BLACK, COLOR_PRIMARY_LIGHT, styled, COLOR_PRIMARY_DARK, css } from "../styles";
import { delay } from "../utility";


const NOTIFICATION_DURATION = 2_000

const Container = styled.div`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: 3px;
    bottom: 12px;
    box-shadow: 0 0 9px -1px ${COLOR_PRIMARY_DARK};
    box-sizing: border-box;
    color: ${COLOR_BLACK};
    cursor: default;
    left: 50%;
    padding: 12px;
    position: fixed;
    text-align: center;
    /* Y translate should account for box-shadow and bottom offset. */
    transform: translate(-50%, calc(100% + 15px));
    transition: transform .3s;
    width: 250px;
    z-index: 250;

    ${(p: StyleProps) => p.active && css`
        transform: translateX(-50%);
    `}
`

interface StyleProps {
    active: boolean
}

interface DispatchProps {
    hide: () => void
}

interface StateProps {
    content: string
}

interface OwnProps {
    children?: any
}

interface State {
    isActive: boolean
}

type Props = OwnProps & StateProps & DispatchProps


class Notification extends React.Component<Props, State> {
    state: State = {
        isActive: false
    }

    componentDidUpdate(prevProps: Props) {
        if(prevProps.content === this.props.content)
            return

        if(!this.props.content.length) {
            this.setState({isActive: false})
        }
        else {
            this.setState({isActive: true})
            this.hide()
        }
    }

    hide = delay(() => {
        this.props.hide()
    }, NOTIFICATION_DURATION)

    render() {
        return (
            <Container active={this.props.content.length > 0}>
                {this.props.content}
            </Container>
        )
    }
}


const mapStateToProps = (state: LubState): StateProps => {
    return {
        content: state.lubNotification
    }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        hide: () => dispatch(setNotification(""))
    }
}

ReduxFactory.addToState({lubNotification: false})
ReduxFactory.addReducers({lubNotification: notificationReducer})

const notif = connect(mapStateToProps, mapDispatchToProps)(Notification) as React.ComponentType<OwnProps>
export { notif as Notification };

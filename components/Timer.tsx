import * as React from "react";
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, styled } from "../styles";
import { wait } from "../utility";
import { padStart } from "../utility/string";


const Container = styled.div`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 3px #555;
    display: flex;
    left: 50%;
    position: fixed;
    top: 0;
    transform: translateX(-50%);
`
const Timepiece = styled.div`
    font-size: 1.2em;
    line-height: 1.2em;
    padding: 6px 15px;

    &:first-of-type {
        border-right: 1px solid ${COLOR_PRIMARY_DARK};
    }
`


interface Props {
    /**
     * Time limit in seconds.
     */
    limit: number

    /**
     * Called when timer expires.
     */
    onExpire?: () => void

    /**
     * Called every second.
     */
    everySecond?: (secondsLeft: number, minutesLeft: number) => void

    /**
     * Called every minute.
     */
    everyMinute?: (secondsLeft: number, minutes: number) => void
}

interface State {
    limit: number
    minutes: number
    seconds: number
}


class Timer extends React.PureComponent<Props, State> {
    state: State = {
        limit: this.props.limit,
        minutes: 0,
        seconds: 0,
    }

    componentDidMount() {
        this.start()
    }

    async start() {
        while(this.state.limit > 0) {
            this.setState(prevState => {
                const limit = prevState.limit - 1
                const minutes = Math.floor(limit / 60)
                const seconds = limit % 60

                if(this.props.everySecond)
                    this.props.everySecond(seconds, minutes)

                if(this.props.everyMinute && prevState.minutes > minutes)
                    this.props.everyMinute(seconds, minutes)

                return {limit, minutes, seconds}
            })

            // Ever wondered how long can a single second be...?
            await wait(1000);
        }
    }

    render() {
        const {seconds, minutes} = this.state

        return (
            <Container>
                <Timepiece>
                    {padStart(minutes.toString(), 2)}
                </Timepiece>
                <Timepiece>
                    {padStart(seconds.toString(), 2)}
                </Timepiece>
            </Container>
        )
    }
}


export { Timer };

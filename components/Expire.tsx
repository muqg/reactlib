import * as React from "react"


interface Props {
    /**
     * Expiration timeout seconds.
     */
    in: number
    /**
     * Callback for when expired.
     */
    then?: () => void
    children?: any
}

interface State {
    isVisible: boolean
}


class Expire extends React.PureComponent<Props, State> {
    state = {
        isVisible: true
    }
    timer: number = -1

    componentDidMount() {
        this.setTimer()
    }

    componentWillUnmount() {
        this.clearTimer()
    }

    componentDidUpdate(prevProps: Props) {
        if(prevProps.children !== this.props.children)
            this.setTimer()
    }

    setTimer() {
        this.clearTimer()
        this.setState({isVisible: true})

        const seconds = Math.max(0, this.props.in) * 1000
        this.timer = setTimeout(this.expire.bind(this), seconds)
    }

    clearTimer() {
        clearTimeout(this.timer)
    }

    expire() {
        this.setState({isVisible: false})
        this.timer = -1

        if(this.props.then)
            this.props.then()
    }

    render() {
        return (
            <>
                {
                    this.state.isVisible ?
                    this.props.children :
                    ""
                }
            </>
        )
    }
}


export default Expire


import * as React from "react"

interface Props {
    in: number
    children?: any
}

interface State {
    isVisible: boolean
}

class Expire extends React.Component {
    state: State
    timer: number = -1

    constructor(public props: Props) {
        super(props)

        this.state = {
            isVisible: true
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.children !== this.props.children) {
            this.setTimer()
            this.setState({visible: true})
        }
    }

    componentDidMount() {
        this.setTimer()
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    setTimer() {
        const seconds = Math.max(0, this.props.in) * 1000

        this.timer = setTimeout(function() {
            this.setState({isVisible: false})
            this.timer = null
        }.bind(this), seconds)
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

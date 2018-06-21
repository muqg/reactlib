import * as React from "react"
import ToolbarItem from "../ToolbarItem";


interface Props {
}
interface State {
}


class ToolbarLink extends React.Component<Props, State> {
    constructor(public props: Props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <ToolbarItem
                className="link tb_img"
                title="Hyperlink"
            />
        )
    }
}


export default ToolbarLink

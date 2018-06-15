import * as React from "react";
import { isUndefined } from "../utility/assertions";

interface LoadableState {
    component?: new() => React.Component
}

function loadAsync(loader: () => Promise<any>, loadingComponent?: LoadableState["component"]) {

    class LoadableComponent extends React.Component {
        static displayName: string
        state: LoadableState

        constructor(public props: any) {
            super(props)

            this.state = {
                component: loadingComponent
            }
        }

        async componentDidMount() {
            try {
                const loaded = await loader()
                this.setState({
                    component: loaded.default
                })
            }
            catch {
                console.error("Error loading: " + loader.toString())
            }
        }

        render() {
            const C = this.state.component
            return !isUndefined(C) ? <C {...this.props} /> : ""
        }
    }

    // TODO: React | Better way to set display name for loadable components.
    LoadableComponent.displayName = `loadable(${loader.toString()})`
    return LoadableComponent
}

export { loadAsync as loadable };

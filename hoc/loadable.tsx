import * as React from "react";
import { isUndefined } from "../utility/assertions";


interface LoadableState {
    component?: new() => React.Component
}


function loadAsync(loader: () => Promise<any>, loadingComponent?: LoadableState["component"]) {

    class LoadableComponent extends React.PureComponent {
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
            catch(ex) {
                console.error("Error loading chunk.")
                throw ex
            }
        }

        render() {
            const C = this.state.component
            return !isUndefined(C) ? <C {...this.props} /> : ""
        }
    }

    // TODO: React | Better way to set display name for loadable components.
    LoadableComponent.displayName = `Loadable(${loader.toString()})`
    return LoadableComponent
}

export { loadAsync as loadable };

import * as React from "react";
import { isUndefined } from "../utility/assertions";


interface LoadableState {
    component?: new() => React.Component
}

/**
 * Allows for a chunk component to be loaded asynchronously at runtime.
 * @param loader A loader function that returns the loaded component.
 * @param loadingComponent A component to be rendered while the loader function
 * is being awaited for.
 */
function loadable(loader: () => Promise<any>, loadingComponent?: LoadableState["component"]) {

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

    // TODO: Lib | Better way to set display name for loadable components.
    LoadableComponent.displayName = `Loadable(${loader.toString()})`
    return LoadableComponent
}

export { loadable };

import * as React from "react";
import { isUndefined } from "../utility/assertions";
import { getDisplayName } from "../utility/misc";


interface LoadableState {
    component?: React.ComponentClass
}

/**
 * Allows for a chunk component to be loaded asynchronously at runtime.
 * @param loader A loader function that returns the loaded component.
 * @param loadingComponent A component to be rendered while the loader function
 * is being awaited for.
 */
function loadable(loader: () => Promise<any>, loadingComponent?: LoadableState["component"]) {

    return class LoadableComponent extends React.PureComponent {
        static displayName: string

        state: LoadableState = {
            component: loadingComponent
        }

        async componentDidMount() {
            try {
                const loaded = await loader()
                const component = loaded.default
                if(!component)
                    console.error("Loadable component does not have a default export.")

                LoadableComponent.displayName = getDisplayName('Loadable', component)

                this.setState({component})
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
}

export { loadable };

import * as React from "react";

export interface StateModelProps<S extends object = {}> {
    readonly lift: StateModel<S>
}

export interface StateModel<S extends object = {}> {
    setState: React.Component["setState"]

    readonly state: S
}

function lift<P extends {} = {}, S extends object = {}>(
    WrappedComponent: React.ComponentType<P & StateModelProps<S>>
): React.ComponentType<P> {

    class withLift extends React.Component<P, S> {
        static displayName: string

        state = {} as S

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    lift={{
                        setState: this.setState,
                        state: this.state
                    } as StateModel<S>}
                />
             )
        }
    }

    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withLift.displayName = `Lift(${name})`
    return withLift
}

export { lift };
import * as React from "react";

export interface LiftProps<S extends object = {}> {
    readonly lift: Lift<S>
}

interface Lift<S extends object = {}> {
    setState: React.Component["setState"]

    readonly state: S
}

function lift<P extends {} = {}, S extends object = {}>(
    WrappedComponent: React.ComponentType<P & LiftProps<S>>
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
                    } as Lift<S>}
                />
             )
        }
    }

    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withLift.displayName = `Lift(${name})`
    return withLift
}

export { lift };
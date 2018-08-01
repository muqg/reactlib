import * as React from "react";

export interface LiftProps<S = {}> {
    readonly model: Lift<S>
}

interface Lift<S = {}> {
    setState: React.Component["setState"]

    readonly state: S
}

function lift<OP = {}, S = {}>(
    WrappedComponent: React.ComponentType<OP & LiftProps<S>>
): React.ComponentType<OP> {

    class withLift extends React.Component<OP, S> {
        static displayName: string

        state = {} as S

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    model={{
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
/*
* NOTE:
* Only use Animation when javascript is required to animate
* the element and cannot be done properly otherwise.
*/

import * as React from "react";
import { StringDict } from "../utility/interfaces";

interface IStyleProps extends StringDict<any>{
    bottom?: string
    height?: string
    left?: string
    opacity?: number
    right?: string
    top?: string
    transitionDuration?: string
    transitionDelay?: string
    width?: string
}

interface Props {
    style: IStyleProps
    noSpecial?: boolean
}

type AnimationType = "" | "fadeIn" | "fadeOut"

const ANIMATION_TYPES: StringDict<any> = {
    fadeIn: { opacity: 1, visibility: "visible" },
    fadeOut: { opacity: 0, visibility: "visible" }
}

/**
 * Enchanced a component allowing it to use animate() function.
 * @param WrappedComponent The component to be enchanced.
 * @param initialStyle Key/value pairs for initial element styling.
 * @param noSpecial No special animations enabled. This does not create a ref.
 */
function Animation(WrappedComponent: any, initialStyle: IStyleProps = {}, noSpecial = false) {

    class withAnimation extends React.Component {
        props: Props = {
            style: {...initialStyle},
            noSpecial: noSpecial,
            ...this.props
        }
        state: IStyleProps = {
            ...(this.props.style)
        }

        static displayName: string
        animationElement?: React.RefObject<any>
        noSpecial: boolean


        constructor(props: Props) {
            super(props)

            this.noSpecial = this.props.noSpecial as boolean
            if(!this.noSpecial)
                this.animationElement = React.createRef()
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    animate={(props: IStyleProps = {}, type: AnimationType = "") => { this.animate(props, type) }}
                    style={this.state}
                    ref={this.animationElement}
                />
             )
        }

        /**
         * Adds style properties to the animation element's style attribute.
         * @param props Key-value pairs of the style properties to be applied.
         * This overrides any previous properties.
         * @param type The name of the special animation type.
         */
        animate(props: IStyleProps = {}, type: AnimationType = "") {
            if(!this.noSpecial) {
                props = {...props, ...ANIMATION_TYPES[type]}
                if(this.animationElement)
                    this.animateSpecial(this.animationElement.current, props)
            }

            const style: StringDict<string> = {}
            for(let key in props)
                style[key] = props[key]

            this.setState(style)
        }

        animateSpecial(container: HTMLElement, props: IStyleProps) {
            // Set height to be equal to element's full height on auto height value.
            if(props.height === "auto") {
                props.height = container.scrollHeight + "px"
            }

            // Set width to be equal to element's full width on auto width value.
            if(props.width === "auto") {
                props.width = container.scrollWidth + "px"
            }
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withAnimation.displayName = `withAnimation(${name})`
    return withAnimation
}


export default Animation

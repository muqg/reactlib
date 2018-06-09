import * as React from "react";
import { StringDict } from "../utility/interfaces";

export interface AnimationProps {
    readonly animate: (props: IStyleProps, type?: AnimationType) => void
}

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
}

type AnimationType = "" | "fadeIn" | "fadeOut"

const ANIMATION_TYPES: StringDict<any> = {
    fadeIn: { opacity: 1, visibility: "visible" },
    fadeOut: { opacity: 0, visibility: "visible" }
}

/**
 * Enchanced a component allowing it to use animate() function.
 *
 * __NOTE:__
 * Only use Animation when javascript is required to animate
 * the element and cannot be done properly otherwise.
 * @param WrappedComponent The component to be enchanced.
 * @param initialStyle Key/value pairs for initial element styling.
 */
function Animation(WrappedComponent: any, initialStyle: IStyleProps = {}) {

    class withAnimation extends React.Component {
        state: IStyleProps = {
            ...(this.props.style)
        }

        static displayName: string
        readonly animationElement: React.RefObject<HTMLElement>

        constructor(public readonly props: Props) {
            super(props)

            this.animationElement = React.createRef()
        }

        componentDidMount() {
            this.animationElement.current.style.cssText = this.getStyleText(initialStyle)
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    animate={(props: IStyleProps, type: AnimationType = "") => { this.animate(props, type) }}
                    ref={this.animationElement}
                />
             )
        }

        getStyleText(styleProps: StringDict<any>) {
            return Object.keys(styleProps).map(key => {
                return `${key}: ${styleProps[key]}`
            }).join(";")
        }

        /**
         * Adds style properties to the animation element's style attribute.
         * @param props Key-value pairs of the style properties to be applied.
         * This overrides any previous properties.
         * @param type The name of the special animation type.
         */
        animate(props: IStyleProps = {}, type: AnimationType = "") {
            const animationElement = this.animationElement.current

            props = {...props, ...ANIMATION_TYPES[type]}
            this.animateSpecial(animationElement, props)

            animationElement.style.cssText = this.getStyleText(props)
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

/*
* NOTE:
* Only use Animation when javascript is required to animate
* the element and cannot be done properly otherwise.
*/

import * as React from "react"

const ALLOWED_PROPS = [
    "bottom",
    "height",
    "left",
    "opacity",
    "right",
    "top",
    "transitionDuration",
    "transitionDelay",
    "width"
]

const ANIMATION_TYPES = {
    "fadeIn": { opacity: 1, visibility: "visible" },
    "fadeOut": { opacity: 0, visibility: "visible" }
}

/**
 * - noSpecial - No special animations enabled. This does not create a ref.
 * - style - Key/value pairs for initial element styling.
 */
function Animation(WrappedComponent) {

    class withAnimation extends React.Component {
        constructor(props) {
            super(props)

            this.state = {...(this.props.style || {})}
            this.noSpecial = this.props.noSpecial || false

            if(!this.noSpecial)
                this.animationElement = React.createRef()
        }

        render() {
             return (
                <WrappedComponent
                    {...this.props}
                    animate={(props = {}, type = null) => { this.animate(props, type) }}
                    style={this.state}
                />
             )
        }

        /**
         * Adds style properties to the animation element's style attribute.
         * @param {any} props Key-value pairs of the style properties to be applied.
         * This overrides any previous properties.
         * @param {string} type The name of the special animation type.
         */
        animate(props = {}, type = null) {
            if(!this.noSpecial) {
                if(type in ANIMATION_TYPES)
                    props = {...props, ...ANIMATION_TYPES[type]}
                animateSpecial(this.animationElement, props, type)
            }

            const style = {}
            for(let key in props) {
                if(key in ALLOWED_PROPS)
                    style[key] = props[key]
            }

            this.setState(style)
        }

        animateSpecial(container, props, type) {
            // Set height to be equal to element's full height on auto height value.
            if(props.height === "auto") {
                props.height = container.scrollHeight
            }

            // Set width to be equal to element's full width on auto width value.
            if(props.width === "auto") {
                props.width = container.scrollWidth
            }
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withAnimation.displayName = `withAnimation(name)`
    return withAnimation
}


export default Animation

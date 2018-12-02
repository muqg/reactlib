import * as React from "react";
import spinnerImage from "../img/tail-spinner.svg";
import { styled } from "../styles";
import { Dict } from "../utility";
import { isUndefined } from "../utility/assertions";


const Sizes: Dict<number> = {
    large: 72,
    medium: 52,
    small: 32
}

const StyledImage = styled.img`
    ${(_p: StyleProps) => ''}

    display: ${p => p.display};
    height: ${p => p.size}px;
    margin: auto;
    padding-bottom: ${p => p.paddingBottom}px;
    padding-top: ${p => p.paddingTop}px;
    width: ${p => p.size}px;

    ${p => !isUndefined(p.visible) && !p.visible && `visibility: hidden;`}
`
StyledImage.defaultProps = {
    display: "block",
    paddingBottom: 0,
    paddingTop: 0,
    size: 64,
}


interface StyleProps {
    display?: Display
    paddingBottom?: number
    paddingTop?: number
    size?: number
    visible?: boolean
}

interface Props {
    className?: string
    display?: Display
    paddingBottom?: number
    paddingTop?: number
    size?: "small" | "medium" | "large"
    visible?: boolean
}
type Display = "block" | "inline-block"


const Spinner = ({size = "medium", ...props}: Props) => {
    return (
        <StyledImage
            src={spinnerImage}
            size={Sizes[size]}
            {...props}
        />
    )
}


export { Spinner };


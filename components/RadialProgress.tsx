import * as React from "react";
import { COLOR_DARK, COLOR_SUCCESS, fadedColor, styled, COLOR_TEXT } from "../styles";
import { Size } from "../utility";
import { clamp } from "../utility/number";

const SIZE_FACTOR = 48
const RADIUS_PERCENT = 40


const StyledCircle = styled.circle`
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset .3s;
`


interface Props {
    size?: Size
    // Progress percentage.
    value: number
}


function RadialProgress({size = Size.Small, value}: Props) {
    value = clamp(value, 0, 100)

    // Determines real size.
    const containerSize = size * SIZE_FACTOR
    const radius = containerSize * RADIUS_PERCENT / 100
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (circumference * value / 100)

    return (
        <svg
            height={containerSize}
            fill="transparent"
            fontSize={radius / 2}
            fontWeight="bold"
            strokeDasharray={circumference}
            width={containerSize}
        >
            <StyledCircle
                cx="50%"
                cy="50%"
                r={`${RADIUS_PERCENT}%`}
                stroke={fadedColor(COLOR_DARK)}
                strokeWidth={size}
            />
            <StyledCircle
                cx="50%"
                cy="50%"
                r={`${RADIUS_PERCENT}%`}
                stroke={COLOR_SUCCESS}
                strokeDashoffset={offset}
                strokeWidth={size + 1}
            />
            <text
                dy=".3em"
                fill={COLOR_TEXT}
                textAnchor="middle"
                x="50%"
                y="50%"
            >
                {value}%
            </text>
        </svg>
    )
}


export { RadialProgress };


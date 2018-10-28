import { FlexDirectionProperty, PositionProperty } from "csstype";
import { css } from ".";

export function truncate(width?: string) {
    return css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ${width && css`width: ${width};`}
    `
}

export function flexCenter(direction: FlexDirectionProperty = "initial") {
    return css`
        align-items: center;
        display: flex;
        flex-direction: ${direction};
        justify-content: center;
    `
}

export function position(pos: PositionProperty, top?: string, right?: string, bottom?: string, left?: string) {
    return css`
        position: ${pos};
        ${top && `top: ${top};`}
        ${right && `right: ${right};`}
        ${bottom && `bottom: ${bottom};`}
        ${left && `left: ${left};`}
    `
}

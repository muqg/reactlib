import { FlexDirectionProperty, PositionProperty } from "csstype";
import { css } from ".";

export function truncateMixin(width?: string) {
    return css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ${width && css`width: ${width};`}
    `
}

export function flexCenterMixin(direction: FlexDirectionProperty = "initial") {
    return css`
        align-items: center;
        display: flex;
        flex-direction: ${direction};
        justify-content: center;
    `
}

type PosType = string | null
export function positionMixin(pos: PositionProperty, top?: PosType, right?: PosType, bottom?: PosType, left?: PosType) {
    return css`
        position: ${pos};
        ${top && `top: ${top};`}
        ${right && `right: ${right};`}
        ${bottom && `bottom: ${bottom};`}
        ${left && `left: ${left};`}
    `
}

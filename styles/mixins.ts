import { css } from ".";
import { FlexDirectionProperty } from "csstype";

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

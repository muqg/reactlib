import { css } from ".";

export function truncateMixin(width?: string) {
    return css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ${width && css`width: ${width};`}
    `
}

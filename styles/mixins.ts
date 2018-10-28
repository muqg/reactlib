import { css } from ".";

export function truncateMixin() {
    return css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `;
}

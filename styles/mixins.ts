import { PositionStyle } from "./types";
import { css } from ".";

export function positionMixin(pos: PositionStyle) {
    return css`
        ${pos.bottom && `bottom: ${pos.bottom};`}
        ${pos.left && `left: ${pos.left};`}
        ${pos.right && `right: ${pos.right};`}
        ${pos.top && `top: ${pos.top};`}
    `
}

export function truncateMixin() {
    return css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `;
}

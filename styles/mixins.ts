import {
  AlignItemsProperty,
  FlexDirectionProperty,
  FlexWrapProperty,
  JustifyContentProperty,
  PositionProperty,
} from "csstype"
import {css} from "."

export function truncate(width?: string) {
  return css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${width &&
      css`
        width: ${width};
      `}
  `
}

export function flex(
  horizontal?: JustifyContentProperty | null,
  vertical?: AlignItemsProperty | null,
  direction?: FlexDirectionProperty | null,
  wrap?: FlexWrapProperty | null,
) {
  return css`
        ${vertical && `align-items: ${vertical};`}
        display: flex;
        ${direction && `flex-direction: ${direction};`}
        ${wrap && `flex-wrap: ${wrap};`}
        ${horizontal && `justify-content: ${horizontal};`}
    `
}

export function position(
  pos: PositionProperty,
  top?: string,
  right?: string,
  bottom?: string,
  left?: string,
) {
  return css`
        position: ${pos};
        ${top && `top: ${top};`}
        ${right && `right: ${right};`}
        ${bottom && `bottom: ${bottom};`}
        ${left && `left: ${left};`}
    `
}

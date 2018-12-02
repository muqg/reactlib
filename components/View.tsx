import * as React from "react";
import { Spinner } from "./Spinner";
import { COLOR_WHITE, css, media, styled } from "../styles";
import { Omit } from "../utility";
import { call } from "../utility/function";

const spinner = <Spinner size="large" />

const narrow = css`
    width: 1024px;
    ${media.desktop`
        width: 768px;
    `}
    ${media.tablet`
        width: 540px;
    `}
    ${media.smallTablet`
        width: 100%;
    `}
`
const center = css`
    align-items: center;
    display: flex;
    flex-direction: column;
`
const edge = css`
    padding: 32px 25px;
    ${media.tablet`
        paddinG: 32px 10px;
    `}
`
const Container = styled.div`
    ${(_p: StyleProps) => ""}

    background: ${COLOR_WHITE};
    box-sizing: border-box;
    margin: auto;
    min-width: 285px;
    position: relative;
    width: 100%;

    ${p => p.center && center}
    ${p => !p.edgeless && edge}
    ${p => p.hidden && css`display: none;`}
    ${p => p.maxWidth && css`max-width: ${p => p.maxWidth}px;`}
    ${p => p.narrow && narrow}
`

interface StyleProps {
    /**
     * Centers the content while preserving its width.
     */
    center?: boolean
    /**
     * Disables the default margins and padding of the container.
     */
    edgeless?: boolean
    /**
     * Hides the view.
     */
    hidden?: boolean
    /**
     * The maximum width of the container.
     */
    maxWidth?: number
    /**
     * Limits the width of the content, adapting to resolution changes.
     */
    narrow?: boolean
}

// Passing ref does not work for SC-4.0.3 typings.
interface View extends Omit<React.HTMLProps<HTMLDivElement>, "ref" | "hidden">, StyleProps {
    /**
     * A custom placeholder to be displayed while loading.
     */
    loader?: () => JSX.Element
    /**
     * Whether the view is loading content or processing a request.
     */
    loading?: boolean
}


function View({children, loader, loading, ...props}: View) {
    const loadingIndicator = call(loader) || spinner

    return (
        <Container {...props}>
            <React.Suspense fallback={loadingIndicator}>
                {loading ? loadingIndicator : !props.hidden && children}
            </React.Suspense>
        </Container>
    )
}


export { View };


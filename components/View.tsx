import * as React from "react";
import { Spinner } from ".";
import { COLOR_WHITE, css, media, styled } from "../styles";
import { Omit } from "../utility";
import { call } from "../utility/function";

const spinner = <Spinner size="large" />

const narrowStyle = css`
    max-width: 1080px;
    ${media.desktop`
        max-width: 720px;
    `}
    ${media.tablet`
        max-width: 540px;
    `}
    ${media.smallTablet`
        max-width: 100%;
    `}
`
const centerStyle = css`
    align-items: center;
    display: flex;
    flex-direction: column;
`
const Container = styled.div`
    ${(_p: StyleProps) => ""}

    background: ${COLOR_WHITE};
    box-sizing: border-box;
    height: 100%;
    margin: auto;
    min-width: 285px;
    padding: 32px 25px;
    position: relative;
    width: 100%;

    ${media.tablet`
        padding: 32px 10px;
    `}

    ${p => p.hidden && css`display: none;`}
    ${p => p.narrow && narrowStyle}
    ${p => p.center && centerStyle}
`

interface StyleProps {
    /**
     * Centers the content while preserving its width.
     */
    center?: boolean
    /**
     * Whether the content is visible.
     */
    hidden?: boolean
    /**
     * Limits the width of the content, adapting to resolution changes.
     */
    narrow?: boolean
}

// Passing ref does not work for SC-4.0.3 typings.
interface View extends Omit<React.HTMLProps<HTMLDivElement>, "ref" | "hidden">, StyleProps {
    loader?: () => JSX.Element
    loading?: boolean
}


function View({children, loader, loading, ...props}: View) {
    const loadingIndicator = call(loader) || spinner

    return (
        <React.Suspense fallback={loadingIndicator}>
            <Container {...props}>
                {loading ? loadingIndicator : !props.hidden && children}
            </Container>
        </React.Suspense>
    )
}


export { View };


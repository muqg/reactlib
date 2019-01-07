import * as React from "react";
import { Spinner } from "../Spinner";
import { COLOR_BACKGROUND, css, media, styled } from "../../styles";
import { Omit } from "../../utility";
import { call } from "../../utility/function";

const spinner = <Spinner size="large" />

const Container = styled.div`
    ${(_p: StyleProps) => ""}

    background: ${COLOR_BACKGROUND};
    box-sizing: border-box;
    margin: 0 auto;
    min-width: 285px;
    position: relative;
    width: 100%;

    padding: 32px 25px;
    ${media.tablet`
        padding: 32px 10px;
    `}

    ${p => p.hidden && css`display: none;`}
`

interface StyleProps {
    /**
     * Hides the view.
     */
    hidden?: boolean
}

// Passing ref does not work for SC-4.0.3 typings.
interface View extends Omit<React.HTMLProps<HTMLDivElement>, "ref" | "hidden" | "as">, StyleProps {
    /**
     * A custom placeholder to be displayed while loading.
     */
    loader?: () => JSX.Element
    /**
     * Whether the view is loading content or processing a request.
     */
    loading?: boolean
}


// In the future, remove loader and loading props
// when using react fetch API and Suspense.
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


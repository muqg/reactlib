import * as React from "react";
import { Fetcher, FetcherProps } from "../components";
import { Omit } from "../utility";


export interface FetcherComponentProps<T extends object> {
    /**
     * The data loaded from the API.
     */
    fetch: T
}


function withFetcher(options: Omit<FetcherProps<any>, "children">) {
    return <P extends FetcherComponentProps<any>>(
        Component: React.ComponentType<P>
    ): React.FunctionComponent<Omit<P, keyof FetcherComponentProps<any>>> => {

        return (props) => (
            <Fetcher {...options}>
                {fetch =>
                    // @ts-ignore TS2322: Type 'Pick<P, Exclude<keyof P, "fetch">>...
                    <Component {...props} fetch={fetch} />
                }
            </Fetcher>
        )

    }
}


export { withFetcher };


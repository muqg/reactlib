import {ComponentType, FunctionComponent} from "react"
import {Fetcher, FetcherProps} from "../components"

export interface FetcherComponentProps<T extends object> {
  /**
   * The data loaded from the API.
   */
  fetch: T
}

function withFetcher(options: Omit<FetcherProps<any>, "children">) {
  return <P extends FetcherComponentProps<any>>(
    Component: ComponentType<P>
  ): FunctionComponent<Omit<P, keyof FetcherComponentProps<any>>> => {
    return (props) => (
      <Fetcher {...options}>
        {(fetch) => (
          // @ts-ignore Correct but not compatible with expected return type.
          <Component {...props} fetch={fetch} />
        )}
      </Fetcher>
    )
  }
}

export {withFetcher}

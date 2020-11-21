import {
  createElement,
  CSSProperties,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

interface Props {
  /**
   * Class that will be applied to the placeholder element.
   */
  className?: string
  children?: ReactNode
  /**
   * Type of the placeholder element.
   *
   * Default: `div`
   */
  placeholderType?: string
  /**
   * Style that will be applied to the placeholder element.
   */
  style?: CSSProperties
  /**
   * Viewport intersection threshold in pixels.
   *
   * Default: `200` (1-2 scroll steps)
   */
  threshold?: number
}

const HAS_INTERSECTION_OBSERVER = typeof IntersectionObserver === "function"

/**
 * Defers the rendering of its children, rendering them lazily
 * only once they are within viewport intersection range.
 * Useful for lazy loading images or anything at all.
 *
 * For best visual results, it is recommended that
 * it is used within a container with minimum height
 * and width set in order to mitigate visual jumping.
 */
export function Lazy({
  children,
  placeholderType = "div",
  threshold = 200,
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(!HAS_INTERSECTION_OBSERVER)
  const placeholder = useRef<HTMLDivElement | null>(null)

  // Should be run on every render in case that placeholder
  // ref ever happens to be null on initial render.
  useLayoutEffect(() => {
    if (loaded || !placeholder.current) {
      return
    }

    const options: IntersectionObserverInit = {
      rootMargin: threshold + "px",
    }
    function onIntersect(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting) {
        setLoaded(true)

        if (observer) {
          observer.disconnect()
          observer = null
        }
      }
    }

    let observer: IntersectionObserver | null = new IntersectionObserver(
      onIntersect,
      options
    )
    observer.observe(placeholder.current)
  })

  if (!loaded) {
    return createElement(placeholderType, {
      ref: placeholder,
      ...props,
    })
  }

  return typeof children === "function" ? children() : children
}

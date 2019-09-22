import {createFetcher} from "./createFetcher"

/**
 * A createFetcher wrapper for suspended image loading. For example when the
 * low quality image is available and can be displayed, while waiting for the
 * higher quality image to load or when it is important that the image is
 * already loaded when the component is rendered.
 */
export const imageResource = createFetcher(
  (src: string) =>
    new Promise<string>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(src)
      image.onerror = reject
      image.src = src
    }),
)

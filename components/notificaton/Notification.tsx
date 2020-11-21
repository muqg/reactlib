import {useEffect, useRef, useState} from "react"
import {useNotify} from "../../hooks"
import {COLOR_CONTRAST, COLOR_DARK, css, styled} from "../../styles"

const NOTIFICATION_DURATION = 2_000

const Wrapper = styled.div`
  border-radius: 4px;
  bottom: 0;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  left: 50%;
  position: fixed;
  transform: translate(-50%, 110%);
  transition: all 0.25s cubic-bezier(0, 0, 0.2, 1);
  z-index: 1400;

  ${(p: StyleProps) =>
    p.active &&
    css`
      transform: translate(-50%, 0);
    `}
`
const Container = styled.div.attrs<StyleProps, StyleProps>((p) => ({
  background: p.background || p.theme.main || COLOR_DARK,
  color: p.color || p.theme.contrast || COLOR_CONTRAST,
}))`
  background: ${(p) => p.background};
  color: ${(p) => p.color};
  font-size: 0.9rem;
  letter-spacing: 0.01071em;
  min-width: 280px;
  max-width: 420px;
  padding: 14px 18px;
`

interface StyleProps extends Omit<NotificationProps, "content"> {
  active?: boolean
}

export interface NotificationProps {
  /**
   * Background color of the notification card.
   */
  background?: string
  /**
   * Foreground color of the notification card.
   */
  color?: string
  /**
   * Notification's content.
   */
  content?: JSX.Element | string
  /**
   * Duration in milliseconds.
   */
  duration?: number
}

function Notification(props: NotificationProps) {
  const [queue, setQueue] = useState<NotificationProps[]>([])
  const [current, setCurrent] = useState<NotificationProps>({})
  const notify = useNotify()
  const timeout = useRef(-1)

  useEffect(() => {
    if (props.content) {
      setQueue((queue) => [...queue, props])
      /**
       * Reset the props coming from above. Since this is the only component
       * updated by this context it should not really affect performance,
       * although measurements have not been made.
       */
      notify("")
    }
  }, [props.content])

  useEffect(() => {
    if (!current.content && queue.length) {
      const [next, ...rest] = queue

      setCurrent(next)
      setQueue(rest)

      timeout.current = setTimeout(
        /**
         * Resetting only content here prevents
         * flashing of notification's default styling.
         */
        () =>
          setCurrent((c) => {
            return {...c, content: ""}
          }),
        next.duration || NOTIFICATION_DURATION
      ) as any
    }
  })

  /**
   * Clear timeout to prevent possible memory leaks
   * and updates on unmounted component.
   */
  useEffect(() => () => clearTimeout(timeout.current), [])

  return (
    <Wrapper active={!!current.content}>
      <Container {...current}>{current.content}</Container>
    </Wrapper>
  )
}

export {Notification}

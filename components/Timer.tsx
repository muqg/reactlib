import * as React from "react"
import {useState} from "react"
import {createPortal} from "react-dom"
import {useInterval} from "../hooks"
import {COLOR_CONTRAST, COLOR_DARK, styled} from "../styles"
import {flex, position} from "../styles/mixins"
import {call} from "../utility/function"

const OneSecond = 1_000

const Container = styled.div`
  background: ${p => p.theme.main || COLOR_DARK};
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 3px ${p => p.theme.main || COLOR_DARK};
  transform: translateX(-50%);
  ${position("fixed", "0", "", "", "50%")}
  ${flex()}
`
const Timepiece = styled.div`
  color: ${p => p.theme.contrast || COLOR_CONTRAST};
  font-size: 1.2em;
  line-height: 1.2em;
  padding: 6px 15px;

  &:first-of-type {
    border-right: 1px solid ${p => p.theme.contrast || COLOR_CONTRAST};
  }
`

interface Props {
  /**
   * Called every second.
   */
  everySecond?: (secondsLeft: number, minutesLeft: number) => void

  /**
   * Called every minute.
   */
  everyMinute?: (secondsLeft: number, minutes: number) => void

  /**
   * Time limit in seconds.
   */
  limit: number

  /**
   * Called when timer expires.
   */
  onExpire?: () => void

  /**
   * Whether the timer is running.
   */
  paused?: boolean
}

const Timer = React.memo(
  ({everySecond, everyMinute, limit, onExpire, paused}: Props) => {
    const [time, setTime] = useState(getTime(limit))

    // Start (or pause) the timer.
    useInterval(tick, paused ? null : OneSecond)

    function tick() {
      if (time.left <= 0) return

      const nextTime = getTime(time.left)

      call(everySecond, nextTime.seconds, nextTime.minutes)
      if (time.minutes > nextTime.minutes) {
        call(everyMinute, nextTime.seconds, nextTime.minutes)
      }
      if (nextTime.left === 0) {
        call(onExpire)
      }

      setTime(nextTime)
    }

    function getTime(limit: number) {
      const left = limit - 1
      const minutes = Math.floor(limit / 60)
      const seconds = limit % 60

      return {left, minutes, seconds}
    }

    const minutes = time.minutes.toString()
    const seconds = time.seconds.toString()
    return createPortal(
      <Container>
        <Timepiece>{minutes.padStart(2, "0")}</Timepiece>
        <Timepiece>{seconds.padStart(2, "0")}</Timepiece>
      </Container>,

      document.body,
    )
  },
)

export {Timer}

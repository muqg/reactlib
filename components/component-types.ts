import {KeyboardEvent, ReactNode} from "react"
import {Size} from "../utility"
import {Dialog} from "./dialogs/Dialog"
import {NotificationProps} from "./notificaton/Notification"

/**
 * Notice!
 * This file only exists for backward compatibility with component types,
 * re-exported in index files. These types raise warnings. NEW TYPES SHOULD BE
 * EXPORTED DIRECTLY AND ONLY FROM INSIDE THE COMPONENT FILE.
 */

export type Notify = (
  content: Required<NotificationProps>["content"],
  options?: Omit<NotificationProps, "content">
) => void

export type DialogBoxProps = {
  children: ReactNode | Dialog["children"]
  fixedHeight?: boolean
  size?: Size
  /**
   * Dialog's title.
   */
  title?: string
}

export type DialogProps = {
  /**
   * Used for styling the outermost div container for the
   * dialog. Do NOT use to stlye any children elements.
   */
  className?: string
  /**
   * Called when dialog is closed.
   */
  onClose: () => void
  /**
   * Called any time a key is pressed down.
   *
   * - Escape key is bound by default to close the dialog.
   */
  onKeyDown?: (e: KeyboardEvent) => void
  /**
   * Called when dialog is shown.
   */
  onShow?: () => void
}

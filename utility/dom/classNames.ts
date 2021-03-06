﻿import {isArray, isNumber, isObject, isString} from "../assertions"
import {Dict} from "../type"

/**
 * Builds a dom element class name string.
 * @param ...classArgs A variable number of strings, numbers and
 * objects to combine into the class name string. Any invalid or
 * duplicate values will be discarded. Duplicate object values
 * that are truthy take precedence over falsey ones.
 */
export function classNames(...classArgs: any[]): string {
  const classes: Dict<boolean> = {}

  classArgs.forEach(arg => {
    if (!arg) return

    if (isString(arg) || isNumber(arg)) {
      classes[arg] = true
    } else if (isObject<Dict<boolean>>(arg) && !isArray(arg)) {
      for (const cls in arg) {
        // Always prefers the TRUE value, i.e. class is applied
        // if at least one of the duplicate values is TRUE.
        classes[cls] = arg[cls] || classes[cls]
      }
    }
  })

  return Object.keys(classes)
    .filter(k => classes[k])
    .join(" ")
}

import {localize} from "./localize"

/**
 * Returns a localize function that returns entries relative to a key level that
 * is noted using dot notation. It is meant to leverage repetitive deep localization
 * key access.
 * @param levelKey The key to the localization level.
 */
function localizeLevel(levelKey: string): typeof localize {
  if (__DEV__) {
    console.warn(
      "`localizeLevel` is deprecated. Consider using translation hook instead.",
    )
  }

  if (levelKey.endsWith("."))
    levelKey = levelKey.substring(0, levelKey.length - 1)

  return (key: any, defaultValue: any = key, ...args: any[]): any => {
    key = levelKey ? `${levelKey}.${key}` : key
    return localize(key, defaultValue, ...args)
  }
}

export {localizeLevel}

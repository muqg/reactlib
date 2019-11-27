type ByteSizeUnit = "Bytes" | "KB" | "MB" | "GB" | "TB"

// Number of bytes in a "thousand".
const k = 1024
const SizeUnits: ByteSizeUnit[] = ["Bytes", "KB", "MB", "GB", "TB"]

/**
 * Returns the number of bytes for the specified byte size format.
 */
export function bytes(value: number, size: ByteSizeUnit): number {
  const pow = SizeUnits.indexOf(size)

  if (pow === 0) {
    return value
  }

  return value * k ** pow
}

/**
 * Returns the size unit for a bytes number.
 */
export function bytesSizeUnit(bytes: number): ByteSizeUnit {
  const pow = Math.floor(Math.log(bytes) / Math.log(k))
  return SizeUnits[pow]
}

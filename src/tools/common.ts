export function pad0x (str: string): string {
  return str.startsWith('0x') ? str : `0x${str}`
}

export function remove0x (str: string): string {
  return str.startsWith('0x') ? str.substring(2) : str
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

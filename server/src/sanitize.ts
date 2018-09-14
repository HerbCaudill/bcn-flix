// Sanitize windows filename
export const sanitize = (s: string): string =>
  s.replace(/^\\.+/g, '').replace(/[\\\\/:*?"<>|]/g, '')

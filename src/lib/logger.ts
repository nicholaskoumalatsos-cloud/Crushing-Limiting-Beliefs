const isDev = import.meta.env.DEV

type LogFn = (...args: unknown[]) => void

function noop() {}

export const logger: { debug: LogFn; info: LogFn; warn: LogFn; error: LogFn } = {
  debug: isDev ? console.debug.bind(console) : noop,
  info: isDev ? console.info.bind(console) : noop,
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}

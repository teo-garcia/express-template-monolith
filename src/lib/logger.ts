import 'dotenv'
import { createLogger, format, transports } from 'winston'

const customFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
  format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}] ${message}`
  })
)

const logger = createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    })
  )
}

export { logger }

import pino from "pino";

//any fields that should be redacted from logs (anything with auth tokens/secrets)
const REDACTED_FIELDS = [];

export default function createLogger({ name, level }) {
  const maxLength = 1024;
  const loggerOptions = {
    name,
    level,
    transport: {
      target: "pino-pretty",
      options: {
        levelFirst: true,
        colorize: true,
        tanslateTime: "SYS:HH:MM:ss.l",
        ignore: "pid,hostname",
      },
      redact: {
        paths: REDACTED_FIELDS,
        censor: "REDACTED",
      },
    },
  };
  const pinoDedstination = pino.destination({ maxLength });
  return pino(loggerOptions, pinoDedstination);
}

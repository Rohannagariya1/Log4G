# @gromo-fintech/log4g

`gromo-log4g-js` is a versatile and easy-to-use logging framework for JavaScript and Nest.js applications. It provides powerful logging capabilities to help developers track and debug their applications efficiently.

# Features

- **Customizable Logging Levels**: Configure different log levels (e.g., DEBUG, INFO, WARN, ERROR) according to your application's needs.

- **Log Formats**: Choose between formatting logs a text or json

- **Log Meta Data**: Logs have meta data useful for debugging like: methodName, lineNumer, className, filePath, timestamp etc.

- **Saves Logs as stdout or files**: Saves logs as stdout / stderr or save as file depending upon config. When storing logs in a file you can choose between storing in a single file, or bifurcated based on log levels.

- **Plug and Play Access Logs**: store logs of every API request that reaches your micro-service. Track host-ip, requester ip, response time of each API alongside trace-id as part of access logs

# Installation

You can install log4g.js via npm:

```bash
npm install @gromo-fintech/log4g.js
```

# Usage

## Basic Usage

```typescript
// import logger
import { logger, LogLevel, LogFormat } from '@gromo-fintech/log4g';

// configure logger [example config]
logger.setConfig({
    enableStdout: true; // if true, prints logs on stdout and stderr
    nameOfProject: "gromoinsure-insurance"; // name of your project. Used to creating log files.
    fileOptions: {
      enableFile: true; // if true, write logs to a file
      logLevel: LogLevel.DEBUG; // define log level to track for files
      datePattern: "DD-MM-YYYY",
      zippedArchive: false, // if true, log files are archived
      maxSize: "10k", // max size of a log file. Set to 10 KB here. 
      maxDuration: "7d", // max duration after which log rotation starts. Set to 7 days here.
    };
    logLevel: LogLevel.DEBUG;
    logFormat: LogFormat.TEXT; // Choose between TEXT and JSON to format logs accordingly
    transporterType: TransporterType.SINGLE_FILE; // Choose between SINGLE_FILE and BIFIRUCATED_BY_LOG_LEVEL
    overrideConsole: true; // if true, it overrides existing `console.log` in your project to log4g's implementation
    enableAccessLog?: true; // if true, stores access logs using interceptor / middleware (needs to be attached)
})
```

# Configuration

gromo-log4g.js can configured to your needs.

| key                       | values                                        | example                     | what it does                                                                                                                                                                                                                                   |   |
|---------------------------|-----------------------------------------------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| enableStdout              | true / false                                  | true                        | if true, prints logs on stdout and stderr                                                                                                                                                                                                      |   |
| nameOfProject             | any string                                    | "testingProject"            | name of your project. Used to creating log files.                                                                                                                                                                                              |   |
| fileOptions .enableFile   | true / false                                  | true                        | if true, write logs to a file                                                                                                                                                                                                                  |   |
| fileOptions.logLevel      | info / debug / warn / error (use enum)        | LogLevel.DEBUG              | define log level to track for files                                                                                                                                                                                                            |   |
| fileOptions.datePattern   | string like "YYYY-MM-DD" or "DD-MM-YYYY"      | "DD-MM-YYYY"                | define date pattern to follow for logs                                                                                                                                                                                                         |   |
| fileOptions.zippedArchive | true / false                                  | true                        | if true, log files are archived                                                                                                                                                                                                                |   |
| fileOptions.maxSize       | size as string alongside unit.                | "10k"                       | max size of a log file. Set to 10 KB here.                                                                                                                                                                                                     |   |
| fileOptions.maxDuration   | max duration after which log rotation starts. | "7d"                        | max duration after which log rotation starts. Set to 7 days here.                                                                                                                                                                              |   |
| logLevel                  | info / debug / warn / error (use enum)        |                             | Overall log level (for stdout), depends                                                                                                                                                                                                        |   |
| logFormat                 | 'text' / 'json' (use enum)                    | LogFormat.TEXT              | Defines how logs are printed, Choose between TEXT or JSON                                                                                                                                                                                      |   |
| transporterType           | 'single_file' / 'bifurcated_by_log_level'     | TransporterType.SINGLE_FILE | Defines how logs files are structured.Choose between SINGLE_FILE and BIFIRUCATED_BY_LOG_LEVEL  SINGLE_FILE -> All application logs are dumped into a single file. BIFIRUCATED_BY_LOG_LEVEL -> Separate log file is created for each log level. |   |
| overrideConsole           | true / false                                  | true                        | if true, it overrides existing `console.log` in your project to log4g's implementation                                                                                                                                                         |   |
| enableAccessLog           | true / false                                  | true                        | if true, stores access logs using interceptor / middleware (needs to be attached)                                                                                                                                                              |   |

# Attaching middleware / interceptor for access logging

In order to store access logs and extract request scope information like `trace-id`, `host-ip`, `requester-ip` etc you need to attach a middleware / interceptor provided by this library to your project.

## For Nest.js projects

For projects implemented using nest.js framework you can use the `LoggerInterceptorNest` class and set it as a global interceptor in your nest project:

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(LoggerInterceptorNest);
```

or you can have it for specific controllers with:

```typescript
@UseInterceptors(LoggerInterceptorNest)
```

## For JavaScript projects

For projects implemented in javascript with express.js or fastify as their core server engine you can use 

```javascript
<to be updated>
```

# Authors

## Rohan Nagariya
Intern - SDE

Rohan Nagariya is an intern at GroMo who has come from DTU and has written majority of the code for this package.

- Email: rohan.nagariya@gromo.in

## Paramdeep Singh Obheroi
Senior Software Engineer

Paramdeep is a Senior Engineer at GroMo. He has designed the package and led Rohan in this project.

- Email: paramdeep.obheroi@gromo.in

## Sahej Aggarwal
Engineering Manager

Sahej is the Engineering Manager at GroMo who has initiated the project.

- Email: sahej.aggarwarl@gromo.in
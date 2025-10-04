// middleware/loggerMiddleware.js
const logger = require('../logger/winston');
const ApiLog = require('../model/apilog.model');

exports.apiLogger = (req, res, next) => {
  const startHrTime = process.hrtime();
  const startCpu = process.cpuUsage();

  res.on('finish', async () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    const cpuUsed = process.cpuUsage(startCpu);
    const cpuUserMs = cpuUsed.user / 1000;
    const cpuSystemMs = cpuUsed.system / 1000;

    const logMsg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsedMs.toFixed(2)} ms (CPU: user ${cpuUserMs.toFixed(2)} ms, sys ${cpuSystemMs.toFixed(2)} ms)`;

    logger.info(logMsg);

    try {
      await ApiLog.create({
        deviceId:req.body.deviceId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        body:req.body,
        responseTimeMs: elapsedMs,
        cpuUserTimeMs: cpuUserMs,
        cpuSystemTimeMs: cpuSystemMs,
      });
    } catch (err) {
      logger.error(`DB Log Error: ${err.message}`);
    }
  });

  next();
};
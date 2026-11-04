import app from "./app";
import { logger } from "./lib/logger";
import { cleanupOrphanedMedia } from "./lib/mediaCleanup";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

const mediaCleanupIntervalMs = 15 * 60 * 1000;

function scheduleOrphanedMediaCleanup(): void {
  void cleanupOrphanedMedia()
    .catch((error) => {
      logger.error({ err: error }, "Orphaned media cleanup failed");
    })
    .finally(() => {
      const mediaCleanupTimer = setTimeout(
        scheduleOrphanedMediaCleanup,
        mediaCleanupIntervalMs,
      );
      mediaCleanupTimer.unref();
    });
}

scheduleOrphanedMediaCleanup();

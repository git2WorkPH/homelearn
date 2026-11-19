import Fastify, { LogController } from "fastify";
export function buildApp() {
  const app = Fastify({
    logger: {
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        'res.headers["set-cookie"]',
      ],
    },
    logController: new LogController({ disableRequestLogging: true }),
  });
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: { status: { type: "string", const: "ok" } },
          },
        },
      },
    },
    async () => ({ status: "ok" }),
  );
  return app;
}

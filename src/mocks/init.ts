import { makeServer } from "./server";

// Initialize MirageJS mock server for development and production (demo mode)
if (typeof globalThis !== "undefined" && !(globalThis as any).server) {
  (globalThis as any).server = makeServer({ environment: "development" });
}

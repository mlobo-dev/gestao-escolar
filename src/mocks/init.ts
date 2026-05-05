import { makeServer } from "./server";

// Initialize MirageJS mock server for development and production (demo mode)
if (typeof window !== "undefined" && !(window as any).server) {
  (window as any).server = makeServer({ environment: "development" });
}

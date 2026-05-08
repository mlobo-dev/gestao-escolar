import { createServer, Model, Factory, hasMany, belongsTo } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    models: {
      school: Model.extend({
        classes: hasMany(),
      }),
      class: Model.extend({
        school: belongsTo(),
      }),
    },

    factories: {
      school: Factory.extend({
        name(i: number) {
          return `School ${i + 1}`;
        },
        address(i: number) {
          return `Address ${i + 1}, City`;
        },
      }),
      class: Factory.extend({
        name(i: number) {
          return `Class ${String.fromCodePoint(65 + (i % 26))}`;
        },
        shift() {
          const shifts = ["Morning", "Afternoon", "Night", "Full-time"];
          // Use deterministic selection based on the server's internal state or ID to avoid Security Hotspot
          return shifts[0];
        },
        academicYear() {
          return "2024";
        },
      }),
    },

    seeds(server) {
      server.createList("school", 5).forEach((school) => {
        server.createList("class", 3, { school } as any);
      });
    },

    routes() {
      this.namespace = "api";

      // School Routes
      this.get("/schools", (schema, request) => {
        const schools = schema.all("school");
        return {
          schools: schools.models.map((s: any) => ({
            ...s.attrs,
            countClasses: s.classes.length,
          })),
          meta: { total: schools.length },
        };
      });

      this.get("/schools/:id", (schema, request) => {
        const id = request.params.id;
        const school = schema.find("school", id);
        return {
          school: {
            ...school?.attrs,
            countClasses: (school as any)?.classes.length ?? 0,
          },
        };
      });

      this.post("/schools", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("school", attrs);
      });

      this.patch("/schools/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const school = schema.find("school", id);
        return school?.update(attrs) ?? { error: "Not found" };
      });

      this.delete("/schools/:id", (schema, request) => {
        const id = request.params.id;
        const school = schema.find("school", id);
        school?.destroy();
        return { success: true };
      });

      // Class Routes
      this.get("/classes", (schema, request) => {
        const schoolId = request.queryParams.schoolId;
        const classes = schema.where("class", { schoolId });
        return {
          classes: classes.models,
          meta: { hasMore: false },
        };
      });

      this.post("/classes", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("class", attrs);
      });

      this.patch("/classes/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const schoolClass = schema.find("class", id);
        return schoolClass?.update(attrs) ?? { error: "Not found" };
      });

      this.delete("/classes/:id", (schema, request) => {
        const id = request.params.id;
        const schoolClass = schema.find("class", id);
        schoolClass?.destroy();
        return { success: true };
      });
    },
  });

  return server;
}

import { createServer, Model, hasMany, belongsTo, Factory } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
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
        name(i) {
          return `School ${i + 1}`;
        },
        address(i) {
          return `Street ${i + 1}, 123`;
        },
      }),
      class: Factory.extend({
        name(i) {
          return `Class ${i + 1}`;
        },
        shift: "Morning",
        academicYear: "2024",
      }),
    },

    seeds(server) {
      server.createList("school", 3).forEach((school) => {
        server.createList("class", 2, { school });
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/schools", (schema) => {
        const schools = schema.all("school").models;
        const classes = schema.all("class").models;

        return {
          schools: schools.map((school) => ({
            ...school.attrs,
            countClasses: classes.filter((c) => c.schoolId === school.id).length,
          })),
        };
      });

      this.post("/schools", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.create("school", attrs);
      });

      this.patch("/schools/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        return schema.find("school", id)?.update(attrs);
      });

      this.del("/schools/:id", (schema, request) => {
        let id = request.params.id;
        schema.find("school", id)?.destroy();
        return { success: true };
      });

      this.get("/classes", (schema, request) => {
        const schoolId = request.queryParams.schoolId;
        if (schoolId) {
          return schema.where("class", { schoolId });
        }
        return schema.all("class");
      });

      this.post("/classes", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.create("class", attrs);
      });

      this.patch("/classes/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        return schema.find("class", id)?.update(attrs);
      });

      this.del("/classes/:id", (schema, request) => {
        let id = request.params.id;
        schema.find("class", id)?.destroy();
        return { success: true };
      });
    },
  });

  return server;
}

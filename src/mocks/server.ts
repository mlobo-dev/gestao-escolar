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
            id: school.id,
            countClasses: classes.filter((c) => String(c.schoolId) === String(school.id)).length,
          })),
        };
      });

      this.post("/schools", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const newSchool = schema.create("school", attrs);
        return { school: { ...newSchool.attrs, id: newSchool.id } };
      });

      this.patch("/schools/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        const updatedSchool = schema.find("school", id)?.update(attrs);
        return { school: { ...updatedSchool?.attrs, id: updatedSchool?.id } };
      });

      this.del("/schools/:id", (schema, request) => {
        let id = request.params.id;
        schema.find("school", id)?.destroy();
        return { success: true };
      });


      this.get("/classes", (schema, request) => {
        const schoolId = request.queryParams.schoolId;
        const classes = schoolId 
          ? schema.where("class", { schoolId }).models
          : schema.all("class").models;
        
        return {
          classes: classes.map(c => ({
            ...c.attrs,
            id: c.id
          }))
        };
      });

      this.post("/classes", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const newClass = schema.create("class", attrs);
        return { class: { ...newClass.attrs, id: newClass.id } };
      });

      this.patch("/classes/:id", (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        const updatedClass = schema.find("class", id)?.update(attrs);
        return { class: { ...updatedClass.attrs, id: updatedClass.id } };
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

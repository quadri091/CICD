const request = require("supertest");

const app = require("./app");

describe("GET /", () => {
  it("returns a greeting", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);

    expect(res.text).toBe("Hello World");
  });
});

describe("GET /status", () => {
  it("reports healthy", async () => {
    const res = await request(app).get("/status");

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toMatch(/healthy/);
  });
});

const { Queue } = require("./ds/queue"); // your Module 5 class

const jobs = new Queue();

app.post("/jobs", (req, res) => {
  if (!req.body?.task) return res.status(400).json({ error: "task required" });

  jobs.enqueue({ task: req.body.task, at: Date.now() });

  res.status(202).json({ queued: jobs.size() });
});

app.post("/jobs/next", (req, res) => {
  const job = jobs.dequeue();

  job ? res.json(job) : res.status(204).end();
});

it("queues and dequeues in FIFO order", async () => {
  await request(app).post("/jobs").send({ task: "a" });

  await request(app).post("/jobs").send({ task: "b" });

  const first = await request(app).post("/jobs/next");

  expect(first.body.task).toBe("a");
});

import { Router } from "express";

const routes = new Router();

let countRequests = 0;
let projects = [];

function checkIfIdExists(req, res, next) {
  const id = req.params.id;

  const task = projects.find(task => {
    return task.id === id;
  });

  if (!task) {
    return res.status(400).json({ error: "Id does not exists" });
  }

  return next();
}

function countRequest(req, res, next) {
  countRequests += 1;
  console.log(`Request number: ${countRequests}`);
  next();
}

routes.post("/projects", countRequest, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

routes.get("/projects", countRequest, (req, res) => {
  return res.json(projects);
});

routes.put("/projects/:id", countRequest, checkIfIdExists, (req, res) => {
  const { title } = req.body;
  const id = req.params.id;

  let taskFind = projects.find(task => {
    return task.id === id;
  });

  taskFind.title = title;
  return res.json(taskFind);
});

routes.delete("/projects/:id", countRequest, checkIfIdExists, (req, res) => {
  const id = req.params.id;

  let taskIndex = projects.findIndex(task => {
    return task.id === id;
  });
  projects.splice(taskIndex, 1);

  return res.json(projects);
});

routes.post(
  "/projects/:id/tasks",
  countRequest,
  checkIfIdExists,
  (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    let taskTitle = projects.find(task => {
      return task.id === id;
    });

    taskTitle.tasks.push(title);

    return res.json(projects);
  }
);

export default routes;

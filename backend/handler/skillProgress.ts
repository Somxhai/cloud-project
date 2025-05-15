import { Hono } from "hono";
import { tryCatchService } from "../lib/utils.ts";
import {
  getCurriculumProgress,
  getProfessorStudentOverview,
  getStudentActivityHistory,
  getStudentProgress,
} from "../database/service/skillProgress.ts";
import { cognitoMiddleware } from "../middleware.ts";

export const progressApp = new Hono();

progressApp.use(cognitoMiddleware);

/* ---- /progress/curriculum/:id ---- */
progressApp.get("/curriculum/:id", (c) =>
  tryCatchService(() => {
    const id = c.req.param(
      "id",
    ) as `${string}-${string}-${string}-${string}-${string}`;
    return getCurriculumProgress(id).then((result) => c.json(result));
  }));

/* ---- /progress/student/:id ---- */
progressApp.get("/student/:id", (c) =>
  tryCatchService(() => {
    const id = c.req.param(
      "id",
    ) as `${string}-${string}-${string}-${string}-${string}`;
    return getStudentProgress(id).then((result) => c.json(result));
  }));

/* ---- /progress/student/:id/activity-history ---- */
progressApp.get("/student/:id/activity-history", (c) =>
  tryCatchService(() => {
    const id = c.req.param(
      "id",
    ) as `${string}-${string}-${string}-${string}-${string}`;
    return getStudentActivityHistory(id).then((result) => c.json(result));
  }));

/* ---- /progress/professor/:id/students ---- */
progressApp.get("/professor/:id/students", (c) =>
  tryCatchService(() => {
    const id = c.req.param(
      "id",
    ) as `${string}-${string}-${string}-${string}-${string}`;
    return getProfessorStudentOverview(id).then((result) => c.json(result));
  }));

/* ----- mount in main.ts ----- */
// import { progressApp } from './handler/skillProgress.ts';
// app.route('/progress', progressApp);

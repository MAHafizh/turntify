import { Router } from "express";
import { getGenre } from "../controller/genre.controller.js";

const router = Router();

router.get("/", getGenre)

export default router
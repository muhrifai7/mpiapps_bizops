import express from "express";
import routes from "./api/routes/index.js";
import xlsx from "xlsx";
import chokidar from "chokidar";
import fs from "fs";
import db from "./config/db.js";

const app = express();
const port = 3002;

// Middleware to parse incoming JSON data
app.use(express.json());

app.use("/api", routes);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const source_folder = "/Users/rifai/CSV_File/upload";

console.log("Source Folder:", source_folder);
const watcher = chokidar.watch(source_folder, { persistent: true });
console.log(watcher, "watcher");

import chokidar from "chokidar";

const root_folder = process.env.SOURCE_FILE;
const upload_path = process.env.UPLOAD_PATH;
const processed_path = process.env.PROCCESSED_FILE;
const failed_path = process.env.FAILED_FILE;
const source_folder = `${root_folder}/${upload_path}`;
const success_folder = `${root_folder}/${processed_path}`;
const failed_folder = `${root_folder}/${failed_path}`;
const watcher = chokidar.watch(`${source_folder}`, {
  persistent: true,
});

watcher.on("ready", () => {
  console.log("Watcher is ready and scanning files...");
});

watcher.on("add", (path) => {
  console.log("File added:", path);
});

watcher.on("change", (path) => {
  console.log("File changed:", path);
});

watcher.on("unlink", (path) => {
  console.log("File removed:", path);
});

watcher.on("error", (error) => {
  console.error("Watcher error:", error);
});

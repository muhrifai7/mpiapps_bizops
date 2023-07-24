import express from "express";
import routes from "./api/routes/index.js";
const app = express();
const port = 3002;

// Middleware to parse incoming JSON data
app.use(express.json());

app.use("/api", routes);
console.log(routes, "routes");
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// middlewares/index.js

// Import any necessary modules or dependencies
import jwt from "jsonwebtoken";

// Define the auth middleware function
export default function auth(req, res, next) {
  // Get the JWT token from the request headers, cookies, or wherever it's stored
  const tokenHeader = req.headers?.authorization || req.cookies.jwt;
  const token = tokenHeader ? tokenHeader.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual JWT secret

    // Attach the decoded user information to the request object for use in route handlers
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error, "error'");
    return res.status(401).json({ error: "Unauthorized" });
  }
}

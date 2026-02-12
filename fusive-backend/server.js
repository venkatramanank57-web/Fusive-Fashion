// ======================================
// MAIN EXPRESS SERVER
// ======================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Contact API route
app.use("/api/contact", contactRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

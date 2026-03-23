import express from "express";
import userRoutes from "./routes/userRoutes.js";
import metricTypeRoutes from "./routes/metricTypeRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/metric-types", metricTypeRoutes);
app.use("/api/units", unitRoutes);
// app.use("/auth", authRoutes);

export default app;
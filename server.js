import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middlewares/auth.js";

const app = express();

app.use(express.json()); // retorna JSON no body do método POST
app.use("/", publicRoutes); // Use the public routes
app.use("/", auth, privateRoutes); // Use the private routes

app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000")
);

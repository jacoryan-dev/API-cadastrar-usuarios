import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middlewares/auth.js";
import cors from "cors";

const app = express();
app.use(cors({})); // Enable CORS for all routes
/* Garantir que app.use(cors()) seja uma das primeiras linhas a serem executadas no arquivo do servidor, 
antes da declaração de qualquer rota.*/

app.use(express.json()); // retorna JSON no body do método POST
app.use("/", publicRoutes); // Use the public routes
app.use("/", auth, privateRoutes); // Use the private routes


app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000")
);

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//Rota de cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword, // Não é recomendao retornar a senha em texto claro para o cliente
      },
    });

    res.status(201).json(userDB);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Rota de login
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    //Busca pelo email o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    //Se o usuário não for encontrado, retorna um erro 404
    if (!user) {
      return res.status(404).json({ error: "Usuário não cadastrado" });
    }

    //Compara a senha informada com a senha armazenada no banco de dados
    const isPasswordValid = await bcrypt.compare(
      userInfo.password,
      user.password
    );

    //Se a senha não for válida, retorna um erro 401
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    //Gerar token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h", // Define o tempo de expiração do token
    });

    res.status(200).json(token);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

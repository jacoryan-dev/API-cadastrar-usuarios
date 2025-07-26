import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado, token não fornecido" });
  }

  try {
    // Verifica o token JWT
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

    req.userId = decoded.id; // Armazena o ID do usuário decodificado no objeto de requisição

    next(); // Chama o próximo middleware ou rota se o token for válido
  } catch (error) {
    console.error("Token inválido:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

export default auth;

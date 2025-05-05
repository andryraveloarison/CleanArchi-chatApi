// infrastructure/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = () => {

  const jwtSecret =  process.env.JWT_SECRET || "supersecret" 

  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.params = decoded as any; // Associe l'utilisateur décodé à la requête
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
};


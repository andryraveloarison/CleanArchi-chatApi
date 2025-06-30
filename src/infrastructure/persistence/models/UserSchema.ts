import mongoose, { Schema, Document } from "mongoose";

// 👤 Interface TypeScript pour le User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  online: boolean;
  key: string;      // clé publique RSA
  photo?: string;   // nom du fichier ou URL de la photo de profil
}

// 🧱 Schéma Mongoose
const UserSchema: Schema = new mongoose.Schema({
  // Nom d'utilisateur
  username: {
    type: String,
    required: true,
    trim: true,
  },

  // Email (unique)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  // Mot de passe hashé
  password: {
    type: String,
    required: true,
  },

  // Statut de connexion
  online: {
    type: Boolean,
    default: false,
  },

  // Clé publique RSA
  key: {
    type: String,
    required: true,
  },

  // 📷 Photo de profil (optionnelle)
  photo: {
    type: String, // tu peux stocker juste le nom du fichier (ex: "1234.jpg")
    default: null,
  },
});

// 📦 Export du modèle
export default mongoose.model<IUser>("User", UserSchema);

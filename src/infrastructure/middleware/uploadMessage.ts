import multer from "multer";
import path from "path";
import fs from "fs";

const dir = path.join(__dirname, "../../../uploads/messages");
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadMessage = multer({ storage });

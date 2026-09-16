import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );

    }
});


const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only .jpeg, .png, .jpg are allowed formats"
            ),
            false
        );

    }
};


const upload = multer({
    storage,
    fileFilter
});

export default upload;
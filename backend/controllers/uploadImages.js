import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadResumeImages = (req, res) => {

    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "profileImage", maxCount: 1 },
    ])(req, res, async (err) => {

        try {

            // 1. Check Multer error
            if (err) {
                console.error("Multer error:", err);

                return res.status(400).json({
                    message: "File upload failed",
                    error: err.message,
                });
            }

            // 2. Get resume ID
            const resumeId = req.params.id;

            // 3. Find resume belonging to logged-in user
            const resume = await Resume.findOne({
                _id: resumeId,
                userId: req.user._id,
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Resume not found or unauthorized",
                });
            }

            // 4. Your uploads folder is:
            // backend/uploads
            const uploadsFolder = path.join(
                __dirname,
                "../uploads"
            );

            // 5. Base URL
            const baseUrl =
                `${req.protocol}://${req.get("host")}/uploads`;

            // 6. Get uploaded files
            const newThumbnail =
                req.files?.thumbnail?.[0];

            const newProfileImage =
                req.files?.profileImage?.[0];


            // =====================================
            // HANDLE THUMBNAIL
            // =====================================

            if (newThumbnail) {

                // Delete old thumbnail
                if (resume.thumbnailLink) {

                    const oldThumbnail = path.join(
                        uploadsFolder,
                        path.basename(resume.thumbnailLink)
                    );

                    if (fs.existsSync(oldThumbnail)) {
                        fs.unlinkSync(oldThumbnail);
                    }
                }

                // Save new thumbnail URL
                resume.thumbnailLink =
                    `${baseUrl}/${newThumbnail.filename}`;
            }


            // =====================================
            // HANDLE PROFILE IMAGE
            // =====================================

            if (newProfileImage) {

                // Make sure profileInfo exists
                if (!resume.profileInfo) {
                    resume.profileInfo = {};
                }

                // Delete old profile image
                if (resume.profileInfo.profilePreviewUrl) {

                    const oldProfile = path.join(
                        uploadsFolder,
                        path.basename(
                            resume.profileInfo.profilePreviewUrl
                        )
                    );

                    if (fs.existsSync(oldProfile)) {
                        fs.unlinkSync(oldProfile);
                    }
                }

                // Save new profile image URL
                resume.profileInfo.profilePreviewUrl =
                    `${baseUrl}/${newProfileImage.filename}`;
            }


            // 7. Save resume
            await resume.save();


            // 8. Send response
            return res.status(200).json({
                message: "Images uploaded successfully",

                thumbnailLink:
                    resume.thumbnailLink,

                profilePreviewUrl:
                    resume.profileInfo?.profilePreviewUrl,
            });

        } catch (error) {

            console.error(
                "Error uploading images:",
                error
            );

            return res.status(500).json({
                message: "Failed to upload images",
                error: error.message,
            });
        }
    });
};
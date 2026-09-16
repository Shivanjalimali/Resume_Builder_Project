import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = (req, res) => {
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "profileImage", maxCount: 1 },
    ])(req, res, async (err) => {

        try {

            // Check Multer upload error
            if (err) {
                return res.status(400).json({
                    message: "File upload failed",
                    error: err.message,
                });
            }

            // Get resume ID from URL
            const resumeId = req.params.id;

            // Find resume belonging to logged-in user
            const resume = await Resume.findOne({
                _id: resumeId,
                userId: req.user._id,
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Resume not found or unauthorized",
                });
            }

            // Same uploads folder used by Multer
            const uploadsFolder = path.join(
                process.cwd(),
                "backend",
                "uploads"
            );

            // Base URL used to access uploaded images
            const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;

            // Get uploaded files
            const newThumbnail = req.files?.thumbnail?.[0];
            const newProfileImage = req.files?.profileImage?.[0];


            // =========================
            // HANDLE THUMBNAIL
            // =========================

            if (newThumbnail) {

                // Delete old thumbnail if it exists
                if (resume.thumbnailLink) {

                    const oldThumbnail = path.join(
                        uploadsFolder,
                        path.basename(resume.thumbnailLink)
                    );

                    if (fs.existsSync(oldThumbnail)) {
                        fs.unlinkSync(oldThumbnail);
                    }
                }

                // Save new thumbnail URL in MongoDB
                resume.thumbnailLink =
                    `${baseUrl}/${newThumbnail.filename}`;
            }


            // =========================
            // HANDLE PROFILE IMAGE
            // =========================

            if (newProfileImage) {

                // Make sure profileInfo exists
                if (!resume.profileInfo) {
                    resume.profileInfo = {};
                }

                // Delete old profile image if it exists
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

                // Save new profile image URL in MongoDB
                resume.profileInfo.profilePreviewUrl =
                    `${baseUrl}/${newProfileImage.filename}`;
            }


            // Save changes to MongoDB
            await resume.save();


            // Send successful response
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
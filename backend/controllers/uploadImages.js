import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'

export const uploadResumeImages = (req, res) => {
    try {
        //configure multer to hanfle images
        upload.fields([{ name: "thun=mbnail" }, { name: "profileImage" }])
            (req, res, async (err) => {
                if (err) {
                    res.status(400).json({ message: "File uploads failed", error: err.message })
                }
                const resumeId = req.params._id;
                const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
                if (!resume) {
                    return res.status(404).json({ message: "Resume not found or authorized" })

                }
                //USE PROCESS CWD TO LOCATE FOLDER
                const uploadsFolder = path.join(process.cwd(), 'uploads');
                const baseurl = `${req.protocol}://${req.get('host')}`;

                const newThumbnail = req.files.thumbnail?.[0];
                const newProfileImage = req.files.profileImage?.[0];

                if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
                        if (fs.existsSync(oldThumbnail)) {
                            fs.unlinkSync(oldThumbnail);
                        }
                        resume.thumbnailLink = `${baseurl}/${newThumbnail.filename}`
                    }
                    //same for profilepreview image
                    if (newProfileImage) {
                        if (resume.profileInfo?.profilePreviewUrl) {
                            const oldprofile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
                            if (fs.existsSync(oldprofile)) {
                                fs.unlinkSync(oldprofile);
                            }
                            resume.profileImage.profilePreviewUrl = `${baseurl}/${newProfileImage.filename}`
                        }

                    }
                }
                await resume.save();
                res.status(200).json({
                    message: "Image upload successfully",
                    thumbnailLink: resume.thumbnailLink,
                    profilePreviewUrl: profileInfo.profilePreviewUrl

                })
            })
    }
    catch (error) {
        console.error("Erros uploading Images:",err);
        res.status(500).json({
            message:"Failed to upload Iamges",
            error:err.message
        })
    }
}
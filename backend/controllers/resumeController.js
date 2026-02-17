import Resume from '../models/resumeModel.js'
import fs, { existsSync, unlinkSync } from 'fs'
import path from 'path'
export const createResume=async (req,res)=>{
    try {
        const {title}=req.body;

        //default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
        const newResume=await Resume.create({
            userId:req.user._id,
            title,
            ...defaultResumeData,
            ...req.body,
        })
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({message:"Failed to create resume",error:error.message})
    }
}

//GET FUNCTION
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.user._id
        }).sort({ updatedAt: -1 });

        res.status(200).json(resumes);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get resume",
            error: error.message
        });
    }
};


//GET RESUME BY ID
export const getResumeById=async (req,res)=>{
    try {
        const resume=await Resume.findOne({_id:req.params.id,userId:req.user._id});
        if(!resume)
        {
            res.status(404).json({message:"Resume not found"});
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({message:"Failed to get resume",error:error.message})
    }
}

//Update Resumes
export const updateResume = async (req, res) => {
    try {
        console.log("Resume ID:", req.params.id);
        console.log("User ID from token:", req.user?._id);

        const resume = await Resume.findOne({
            _id: req.params.id,   // ✅ FIXED
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found or authorized"
            });
        }

        Object.assign(resume, req.body);

        const savedResume = await resume.save();

        return res.status(200).json(savedResume);

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        });
    }
};

//DELETE RESUME FUNCTION
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or authorized" });
        }

        const uploadsFolder = path.join(process.cwd(), 'uploads');

        // Delete thumbnail
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
                uploadsFolder,
                path.basename(resume.thumbnailLink)
            );

            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // Delete profile image
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadsFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            );

            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        res.status(200).json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};



/*
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or authorized" });
        }

        await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};



*/
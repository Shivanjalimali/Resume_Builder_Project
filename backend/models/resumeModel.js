import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: "true",
         index: true
    },
    title: {
        type: String,
        required: true
    },
    thumnailLink: {
        type: String
    },
    template: {
        theme: String,
        colorPaletee: [String]
    },
    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String
    },
    contactInfo: {
        phone: String,
        email: String,
        location: String,
        linkedin: String,
        github: String,
        website: String
    },
    //WORK EXPERIENCE
    workExperience: [
        {
            comapany: String,
            role: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],
    Education: [
        {
            degree: String,
            institution: String,
            startDate: String,
            endDate: String,
        },
    ],
    skills: [
        {
            name: String,
            progress: Number,
        },
    ],
    projects: [
        {
            title: String,
            description: String,
            github: String,
            liveDemo: String,
        },
    ],
    certifications: [
        {
            title: String,
            issuer: String,
            year: String,
        },
    ],
    languages: [
        {
        name: String,
        progress: Number,
        },
    ],
    interests:[String],
},
{
    timestamps:{createdAt:"createAt",updateAt:"updateAt"}
})

export default mongoose.model('Resume',resumeSchema);
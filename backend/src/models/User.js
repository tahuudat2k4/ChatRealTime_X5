import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        trim: true, // Remove whitespace
        lowercase: true // Convert to lowercase
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, // link CDN to display avatar 
    },
    avatarId:{
        type: String, // cloudinary public id for deleting the image
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        trim: true,
        sparse: true // Allows multiple null values but enforces uniqueness on non-null values just one phonenumber per user
    }
}, {
    timestamps: true // MongoDB automatically add createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;

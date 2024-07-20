const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    dob: {
        type: String,
        required: true,
    },
   
    hasPaid: { type: Boolean, default: false },
    lastPaymentDate: { type: Date, default: null },

    // isSubscribed: { type: Boolean, default: false },
    
    bookmarks: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: "Video" 
        }
    ], 
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

userSchema.methods.calculateAge = function() {
    const birthDate = new Date(this.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

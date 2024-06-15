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
		// required: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
	bio: {
		type: String,
		// required: true,
	},
	avatar: {
		type: String,
		// required: true,
		default:
			"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
	},
	coverImage: {
		type: String,
		// required: true,
		default:
			"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
	},
	dob: {
		type: String,
		required: true,
	},
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

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

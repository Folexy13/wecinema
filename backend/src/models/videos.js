const mongoose = require("mongoose");

const { Schema } = mongoose;

const videoSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		genre: {
			type: Schema.Types.Mixed,
			required: true,
		},
		thumbnail: {
			type: String,
			// required: true,
		},
		published: {
			type: Boolean,
			default: true,
		},
		recommended: {
			type: Boolean,
			default: false,
		},
		file: {
			type: String,
			required: true,
		},
		red_carpet: {
			type: Boolean,
			default: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		likes: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		dislikes: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		comments: {
			type: Schema.Types.Mixed,
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
);
const videoModel = mongoose.model("Video", videoSchema);
module.exports = videoModel;

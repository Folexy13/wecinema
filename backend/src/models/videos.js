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
			// required: true,
		},
		slug: {
			type: String,
		},
		genre: {
			type: Schema.Types.Mixed,
			required: true,
		},
		rating: {
			type: String,
			required: true,
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
		users: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

		hidden: {
			type: Boolean,
			default: false,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		views: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		status: {
			type: Boolean,
			default: true,
		},
		comments: [
			{
				type: Schema.Types.Mixed,
			},
		],
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
);

const videoModel = mongoose.model("Video", videoSchema);
module.exports = videoModel;

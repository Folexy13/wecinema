const mongoose = require("mongoose");
const Video = require("./src/models/videos"); // Adjust the path as needed

mongoose.connect(
	"mongodb+srv://folajimi:oluwabunmi@hashnode.d43tn.mongodb.net/?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const updateExistingDocuments = async () => {
	try {
		const videos = await Video.find();

		for (const video of videos) {
			if (!video.createdAt) {
				video.createdAt = new Date();
				await video.save();
				console.log(`Updated createdAt for video with ID ${video._id}`);
			}
		}

		console.log("CreatedAt update completed.");
	} catch (error) {
		console.error("Error updating createdAt:", error);
	} finally {
		mongoose.disconnect();
	}
};

updateExistingDocuments();

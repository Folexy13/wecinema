// models/Liked.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Liked = sequelize.define("Liked", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		video: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},

		user: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		date_liked: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Add more fields as needed
	});

	return Liked;
};

// models/Disliked.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Disliked = sequelize.define("Disliked", {
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
		date_disliked: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Add more fields as needed
	});

	return Disliked;
};

// models/Followings.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Followings = sequelize.define("Followings", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		follow: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		user: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		date_followed: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Add more fields as needed
	});

	return Followings;
};

// models/User.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Watch_History = sequelize.define("Watch_History ", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		video: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		// Add more fields as needed
	});

	return Watch_History ;
};

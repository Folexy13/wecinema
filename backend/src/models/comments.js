// models/Comments.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Comments = sequelize.define("Comments", {
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
		comment: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		user: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		parent: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		commented_on: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Add more fields as needed
	});

	return Comments;
};

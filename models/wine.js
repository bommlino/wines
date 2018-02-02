const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');

const WineSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		year: {
			type: Number,
			required: true,
			trim: true,
		},
		country: {
			type: String,
			required: true,
			trim: true,
		},		
		type: {
			type: String,
			required: true,
			enum: ['red', 'white', 'rose']
		},
		description: {
			type: String,
			trim: true,
		}
	},
	{ minimize: false },
);

WineSchema.plugin(mongooseStringQuery);

const Wine = mongoose.model('Wine', WineSchema);
module.exports = Wine; 
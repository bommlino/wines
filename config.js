module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 5000,
	db: {
		uri: process.env.MONGODB_URI
	}
}
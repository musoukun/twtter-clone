const mongoose = require("mongoose");

const resetDatabase = async () => {
	try {
		await mongoose.connect(
			"mongodb://root:example@localhost:27017/twitter_clone?authSource=admin",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		await mongoose.connection.dropDatabase();
		console.log("Database reset successfully");
	} catch (error) {
		console.error("Error resetting database:", error);
	} finally {
		mongoose.connection.close();
	}
};

resetDatabase();

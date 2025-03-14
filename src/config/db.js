
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Coonected to database");
        
    } catch (error) {
        console.error("Database connection failed :",err);
        process.exit(1)
    }
}

module.exports =connectDB
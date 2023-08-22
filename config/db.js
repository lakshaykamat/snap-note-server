const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log({
      message:"Database connected successfully",
      database_name:connect.connection.name,
      host:connect.connection.host,
      port:connect.connection.port,
    }
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDb;

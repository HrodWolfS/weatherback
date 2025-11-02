const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING ||
  "mongodb+srv://stempfelrodolphe_db_user:5GvbqdnpgeWPS2ZT@cities.s7gpapg.mongodb.net/weatherapp";

mongoose
  .connect(connectionString, {
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

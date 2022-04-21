const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected to MongoDB...'))
	.catch((err) => console.log(err));

app.listen(5000, () => {
	console.log('server is running!');
});

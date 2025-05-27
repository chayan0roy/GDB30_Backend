const express = require('express');
const app = express();
const dotenv = require('dotenv');

const db = require('./config/db');


const userRoutes = require('./routes/userRoutes');

dotenv.config();

app.use(express.json());

app.use('/user', userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
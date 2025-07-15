const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ConnectDB = require("./Database/connect");

const loginRoutes = require('./routes/loginRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

require('dotenv').config();
ConnectDB(process.env.MONGODB_URL);
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`${PORT}`);
});

app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipe', recipeRoutes);
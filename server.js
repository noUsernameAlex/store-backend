const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exercisesRouter = require('./routes/exercises');
const userRouter = require('./routes/user');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

app.use('/exercises', exercisesRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`server is running on : ${port}`);
});

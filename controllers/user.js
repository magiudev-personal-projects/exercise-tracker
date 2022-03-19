const { isValidObjectId } = require("mongoose");
const User = require("../entities/user.js");
const Exercise = require("../entities/exercise.js");

const createUser = async (req, res) => {
  const {username} = req.body;
  if(!username) return res.status(400).json({ error: "Invalid username"})
  let user = await User.findOne({ username });
  if(!user) {
    user = new User({username});
    await user.save();
  } 
  res.status(201).json({ username, "_id": user.id });
}

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json([ ...users]);
}

const registerExercise = async (req, res) => {

  // Get data
  const {_id} = req.params;
  let {description, duration, date} = req.body;

  // Check data
  if(!isValidObjectId(_id)) return res.status(400).json({ error: "Invalid user id"});
  if(!description) return res.status(400).json({ error: "The description is required"});
  if(!typeof description === "string") return res.status(400).json({ error: "Invalid description"});
  if(!duration) return res.status(400).json({ error: "The duration is required"});
  if(!typeof duration === "number") return res.status(400).json({ error: "Invalid duration"});
  if (!date) date = new Date();
  else {
    date = new Date(date);
    if(isNaN(date.getTime())) return res.status(400).json({ error: "Invalid date"});
  }
  const user = await User.findById(_id);
  if(!user) return res.status(400).json({ error: "Invalid user id"});

  // Register the exercise
  const newExerciseRegister = await Exercise({ 
    userId: _id, 
    description, 
    duration, 
    date 
  });
  await newExerciseRegister.save();

  // Send a response
  res.status(201).json({
    _id: user.id,
    username: user.username,
    date: date.toDateString(),
    duration: Number(duration),
    description
  });
}

const log = async (req, res) => {
  
  // Get the data
  const {_id} = req.params;
  let {limit, from, to} = req.query;
  
  // check the data
  if(!isValidObjectId(_id)) return res.status(400).json({ error: "Invalid user id"});
  if (from) {
    from = new Date(from);
    if(isNaN(from.getTime())) return response.status(400).json({ error: 'The "from" query param is invalid' });
  }
  if (to) {
    to = new Date(to);
    if(isNaN(to.getTime())) return response.status(400).json({ error: 'The "to" query param is invalid' });
  }
  const user = await User.findById(_id);
  if(!user) return res.status(400).json({ error: "Invalid user id"});

  // Build the query
  const query = Exercise.find({ userId: _id });
  if(from || to) query.where("date");
  if (from) query.gte(from);
  if (to) query.lt(to);
  if (limit) query.limit(limit).sort({ date: -1 });

  // Execute the query ans send a response
  query.exec((error, results) => {
    if(error) return res.status(500).json({ error: "Server error"});
    const resultsFormatted = results.map( ({ description, duration, date }) => ({ description, duration, date: date.toDateString() }));
    return res.json({
      username: user.username,
      count: results.length,
      _id,
      log: resultsFormatted
    })
  });
}

module.exports = {
  createUser,
  getUsers,
  registerExercise,
  log
}
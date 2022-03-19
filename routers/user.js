const express = require('express');
const router = express.Router();
const { createUser, getUsers, registerExercise, log } = require("../controllers/user");

router.post('/', createUser);
router.get('/', getUsers);
router.post('/:_id/exercises', registerExercise);
router.get('/:_id/logs', log);

module.exports = router;
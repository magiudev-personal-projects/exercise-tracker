const {Schema, model} = require("mongoose");

const ExerciseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    description: String,
    duration: Number,
    date: Date
})

const Exercise = new model("exercise", ExerciseSchema);

module.exports = Exercise;
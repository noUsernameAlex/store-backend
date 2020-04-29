const router = require('express').Router();
let Exercise = require('../models/exercises.model');

router.route('/').get((req, res) => {
    Exercise.find()
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('error:' + err));
});


module.exports = router;

const router = require('express').Router();
let User = require('../models/user.model');
const Admin = require('../models/admin.model');
const bcrypt = require("bcrypt");

// user login
router.route('/').post((req, res) => {
  const {email, password} = req.body;
  let userIsAdmin = false;
  User.findOne({ email : email }).then(user => {
    // Check if user exists
    console.log(`${email} is trying to log in!`);
    if (!user) {
      return res.status(400).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        console.log("111");
        Admin.findOne({email : email}).then(adminResult => {
          if (adminResult) {
            console.log("222");
            res.json({
              isAdmin : true,
              success: true,
            });
          } else {
            res.json({
              success: true,
            });
            console.log(`${email} logged in successfully!`);
          }
        });
      } else {
        res.status(400).json('password incorrect');
      }
    });
  });
});

// check if the user name exist
router.route('/all').get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('error:' + err));
});


// add the user into database
router.route('/addAdmin').post((req, res) => {
  const {email, password} = req.body;
  console.log('adding admin : email' + email + " password : " + password);

  Admin.findOne({ email: email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newAdmin = new Admin({
          email: email,
          password: password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newAdmin.password = hash;
            newAdmin
              .save()
              .then(newAdmin => {res.json(newAdmin)})
              .catch(err => console.log(err));
          });
        });
      }
    });
});

router.route('/add').post((req, res) => {
  const {email, password} = req.body;
  console.log('email' + email + "initial password " + password);
  User.findOne({ email: email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          email: email,
          password: password,
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {res.json(user)})
              .catch(err => console.log(err));
          });
        });
      }
    });
});

module.exports = router;

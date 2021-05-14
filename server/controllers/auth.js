const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
        <p>Please use the following link to activate your account</p>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    sgMail
      .send(emailData)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired Link, Signup Again",
          });
        }

        const { name, email, password } = jwt.decode(token);
        const newUser = new User({ name, email });

        newUser
          .encryptPassword(password)
          .then((hashed) => {
            newUser.hashed_password = hashed;
            console.log(newUser.hashed_password, hashed);

            newUser.save((err, success) => {
              console.log({ success });
              if (err) {
                return res.status(400).json({
                  error: err,
                });
              }
              res.json({
                message: "Signup success!, Please Signin",
              });
            });
          })
          .catch(console.log);
      }
    );
  }
};

exports.oldsignin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist, Please Signup.",
      });
    }

    // authenticate
    const match = user.authenticate(password);

    console.log({ user, match });

    if (!match) {
      return res.status(400).json({
        error: "Email and Password does not match",
      });
    }

    // generate token and send to client

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    console.log(user);
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log({ email, password });
    const user = await User.findOne({ email });
    console.log("GG", user.hashed_password);
    if (user) {
      const match = await user.authenticate(password);
      
      console.log({ match: match });
      if (match) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const { _id, name, email, role } = user;
        return res.json({
          token,
          user: { _id, name, email, role },
        });
      }
      return res.status(400).json({
        error: "Not matched",
      });
    }
    return res.status(400).json({
      error: "No user",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Error",
    });
  }
};

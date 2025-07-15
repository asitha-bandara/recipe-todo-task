const UserModel = require("../models/users");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  try {
    const { name, dob, nic, email, password } = req.body;

    const user = new UserModel({
      username: name,
      dob,
      nic,
      email,
      password,
      role: "user", // explicitly set role to 'user'
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    let errorMessage;
    let statusCode = 500; // default error status

    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0]; // Extracts 'email' or 'nic'
      if (duplicateField === "nic") {
        errorMessage = "User with this NIC already exists";
      } else if (duplicateField === "email") {
        errorMessage = "User with this email already exists";
      } else {
        errorMessage = "Duplicate field error";
      }
      statusCode = 409;
    } else if (err.name === "ValidationError") {
      errorMessage = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    } else {
      errorMessage = err.message;
    }

    res.status(statusCode).json({
      status: "failed",
      message: errorMessage,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, dob, nic, oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (dob) user.dob = dob;
    if (nic) user.nic = nic;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Existing password is incorrect" });
      }
      user.password = newPassword;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "User updated successfully", user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsernameOnly = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

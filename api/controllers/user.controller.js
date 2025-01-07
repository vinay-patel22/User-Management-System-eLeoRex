import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API is working!",
  });
};

// update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Edit user (for admin and manager)
export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Error updating user", error: err });
  }
};

// Function to get the profile of the logged-in user
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Only admins or managers can fetch all users
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

export const addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate that all required fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the newly created user
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    // Catch any errors and respond with a message
    res.status(500).json({ message: "Error adding user", error: err.message });
  }
};

// Delete user (only for admin)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting user", error: err });
  }
};

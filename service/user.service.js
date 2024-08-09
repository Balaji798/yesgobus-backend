import User from "../modals/user.modal.js";
//import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomNumber } from "../utils/generateRandomNumber.js";
import Agent from "../modals/agents.modal.js";
import axios from "axios";

export const signUp = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return {
        status: 409,
        message: "email is already in use",
      };
    }
    const phoneExist = await User.findOne({ email: userData.phoneNumber });
    if (phoneExist) {
      return {
        status: 409,
        message: "Phone Number is already in use",
      };
    }
    if (!existingUser) {
      const response = await axios.post(
        "https://auth.otpless.app/auth/otp/v1/send",
        {
          phoneNumber: `91${userData.phoneNumber}`,
          otpLength: 6,
          channel: "SMS",
          expiry: 600,
        },
        {
          headers: {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            "Content-Type": "application/json",
          },
        }
      );
      return {
        status: 200,
        message: "OTP send Successful",
        data: response.data,
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const signIn = async (mobileNumber) => {
  try {
    const existingAgent = await Agent.findOne({
      $or: [{ email: mobileNumber }, { phNum: mobileNumber }],
      status: true,
    });
    let existingUser = "";

    if (existingAgent) {
      existingUser = await User.findOne({
        _id: existingAgent.id,
      });
    } else {
      existingUser = await User.findOne({ phoneNumber: mobileNumber });
    }
    if (!existingUser) {
      return {
        status: 401,
        message: "You are not signup, signup first",
      };
    }
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber: `91${mobileNumber}`,
        otpLength: 6,
        channel: "SMS",
        expiry: 600,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      status: 200,
      data: response.data,
      message: "Signup Successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const googleSignUp = async (jwtToken) => {
  try {
    const { email, name } = jwt.decode(jwtToken);
    const userId = generateRandomNumber(8);
    const newUser = await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email: email,
          fullName: name,
          userId: userId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);

    return {
      status: 200,
      message: "Google SignIn successfull",
      data: newUser,
      token: token,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const facebookSignUp = async ({ name, email }) => {
  try {
    const userId = generateRandomNumber(8);
    const newUser = await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email,
          fullName: name,
          userId: userId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);

    return {
      status: 200,
      message: "Facebook SignIn successfull",
      data: newUser,
      token: token,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const existingUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!existingUser) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    existingUser.password = undefined;
    return {
      status: 200,
      message: "Profile updated successfully",
      data: existingUser,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: err.message || "Internal server error",
    };
  }
};

import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import generateOTP from "../../../helpers/generateOtp";
import sendEmail from "../../../helpers/sendEmail";

//login user
const loginUserIntoDB = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, createdAt, updatedAt, ...userInfo } = user;

  return {
    accessToken,
    userInfo,
    password,
  };
};

const googleLoginIntoDB = async (userName: string, email: string) => {
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        userName: userName,
        email: email,
        password: "12Ab565@",
      },
    });
  }

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return { accessToken, user };
};

//send forgot password otp
const sendForgotPasswordOtpDB = async (email: string) => {
  const existringUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existringUser) {
    throw new ApiError(404, "User not found");
  }
  // Generate OTP and expiry time
  const otp = generateOTP(); // 4-digit OTP
  const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minute
  const expiresAt = Date.now() + OTP_EXPIRATION_TIME;
  const subject = "Your Password Reset OTP";
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Password Reset Request</h2>
    <p>Hi <b>${existringUser.userName}</b>,</p>
    <p>Your OTP for password reset is:</p>
    <h1 style="color: #007BFF;">${otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
    <p>Thanks, <br>The Support Team</p>
  </div>
`;
  await sendEmail(email, subject, html);
  await prisma.otp.upsert({
    where: {
      email: email,
    },
    update: { otpCode: otp, expiresAt: new Date(expiresAt) },
    create: { email: email, otpCode: otp, expiresAt: new Date(expiresAt) },
  });

  return otp;
};

// const changePasswordFromDB = async (
//   userId: string,
//   newPassword: string,
//   oldPassword: string
// ) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id: userId },
//   });
//   if (!existingUser || !(await bcrypt.compare(oldPassword, existingUser.password))) {
//     throw new Error("Invalid email or password");
//   }

//   const hashedPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.jwt.gen_salt)
//   );

//   const result = await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       password: hashedPassword,
//     },
//   });
//   const { password, ...userInfo } = result;
//   return userInfo;
// };

// verify otp code

const changePasswordFromDB = async (
  userId: string,
  newPassword: string,
  oldPassword: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (
    !existingUser ||
    !(await bcrypt.compare(oldPassword, existingUser.password))
  ) {
    throw new Error("Invalid old password");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt)
  );

  const [updatedUser, notification] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    }),
    prisma.notification.create({
      data: {
        userId: userId,
        message: "Your password has been changed successfully.",
      },
    }),
  ]);

  const { password, ...userInfo } = updatedUser;
  return userInfo;
};

const verifyForgotPasswordOtpCodeDB = async (payload: any) => {
  const { email, otp } = payload;

  if (!email && !otp) {
    throw new ApiError(400, "Email and OTP are required.");
  }

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user.id;

  const verifyData = await prisma.otp.findUnique({
    where: {
      email: email,
    },
  });

  if (!verifyData) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  const { otpCode: savedOtp, expiresAt } = verifyData;

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  if (Date.now() > expiresAt.getTime()) {
    await prisma.otp.delete({
      where: {
        email: email,
      },
    }); // OTP has expired
    throw new ApiError(410, "OTP has expired. Please request a new OTP.");
  }

  // OTP is valid
  await prisma.otp.delete({
    where: {
      email: email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: userId, email },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return { accessToken: accessToken };
};

// reset password
const resetForgotPasswordDB = async (newPassword: string, userId: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }
  const email = existingUser.email as string;
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt)
  );

  const result = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });
  const { password, ...userInfo } = result;
  return userInfo;
};

export const authService = {
  loginUserIntoDB,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
  changePasswordFromDB,
  googleLoginIntoDB,
};

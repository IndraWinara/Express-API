import bcrypt from "bcryptjs";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import { NextFunction, Request, Response, request } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.model";
import { signToken } from "../services/jwt";
import Contact from "../models/contact.model";
import Job from "../models/job.model";
import Addres from "../models/addres.model";
import { createActivationToken } from "../services/activation";
import path from "path";
import ejs from "ejs";
import sendMail from "../services/sendMail";
import jwt, { Secret } from "jsonwebtoken";

//interface register
interface IRegisterUser {
  username: string;
  email: string;
  password: string;
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      const userData: IRegisterUser = {
        username,
        email,
        password: hashPassword,
      };

      const activationToken = createActivationToken(userData);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: userData.username }, activationCode };
      await ejs.renderFile(
        path.join(__dirname, "../mails/activation-email.ejs"),
        data
      );

      await sendMail({
        email: userData.email,
        subject: "Activate Your Account",
        template: "activation-email.ejs",
        data,
      });

      return res.status(201).json({
        success: true,
        message: "Please Check your email to activate account",
        token : activationToken.token
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error Register User : ${error.message}`, 400)
      );
    }
  }
);

//interface aktivasi
interface IAktivasi {
  activation_token: string;
  activation_code: string;
}

interface IVerifyUser {
  user: any;
  activationCode: string;
}

export const activationAccount = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } = req.body;

      //vefikasi jwt

      const verifyUser: IVerifyUser = jwt.verify(
        activation_token,
        process.env.SECRET as string
      ) as IVerifyUser;

      if (activation_code !== verifyUser.activationCode) {
        return next(new ErrorHandler(`Wrong OTP code`, 400));
      }

      //payload data
      const { username, email, password } = verifyUser.user;
      const isUserExist = await User.findOne({ email });

      if (isUserExist) {
        return next(new ErrorHandler("User Telah Teraktivasi", 400));
      }

      await User.create({
        username,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Success Verifiying Account",
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error Verification Account : ${error.message}`, 500)
      );
    }
  }
);

//interface login

interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: `Invalid credentials`,
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch === false) {
        return res.status(400).json({
          success: false,
          message: `invalid credentials`,
        });
      }

      const token = signToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Success Login",
        token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(`Error Login User : ${error.message}`, 400));
    }
  }
);

//inteface authrequest

interface AuthRequest extends Request {
  user?: any;
}
export const userInformation = CatchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userInfo = req.user;

      const userData = await User.findById(userInfo)
        .select("-password")
        .populate({
          path: "contact",
          model: Contact,
          populate: [
            {
              path : 'owner',
              model : User,
              select : ['_id','username','email']
            },
            {
              path: "jobs",
              model: Job,
              populate : {
                path : 'owner',
                model : User,
                select : ['_id','username','email']
              }
            },
            {
              path: "address",
              model: Addres,
              populate : {
                path : 'owner',
                model : User,
                select : ['_id','username','email']
              }
            },
          ],
        });

      return res.status(200).json({
        success: true,
        userData,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error User Information : ${error.message}`, 400)
      );
    }
  }
);

interface IUserUpdate {
  image: string;
  bio: string;
}

export const userUpdate = CatchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { image, bio } = req.body;
      const userInfo = req.user;
      const userData: IUserUpdate = {
        image,
        bio,
      };
      await User.findByIdAndUpdate(userInfo, userData);

      return res.status(200).json({
        success: true,
        message: "Success Update User",
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error User Update : ${error.message}`, 400)
      );
    }
  }
);

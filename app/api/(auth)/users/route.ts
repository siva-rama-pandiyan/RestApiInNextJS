import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { ObjectId } from "bson";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const objectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err: any) {
    return new NextResponse("Error in fetching users" + err.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in creating users" + err.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName } = body;
    await connect();
    if (!userId || !newUserName) {
      return new NextResponse(
        JSON.stringify({ message: "Id or new username not found" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user id" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUserName },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database" }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in updating users" + err.message, {
      status: 500,
    });
  }
};

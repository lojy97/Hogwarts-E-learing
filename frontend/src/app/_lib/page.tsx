import mongoose from "mongoose";
import {UserRole }from "../../../../backend/src/user/models/user.schema";
export interface course{
    _id:object,
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    isOutdated: boolean;
    ratingCount: number;
    averageRating: number;
    BeginnerCount: number;
    IntermediateCount: number;
    AdvancedCount: number;
}

export interface student{
    _id:object,
    name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profilePictureUrl?: string;
  emailVerified: boolean;
  token: string;
  ratingsc?: Number;
  avgRating?: Number;

}

export interface admin{
    _id:object,
    name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profilePictureUrl?: string;
  emailVerified: boolean;
  token: string;
  ratingsc?: Number;
  avgRating?: Number;

}
export interface instructor{
    _id:object,
    name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profilePictureUrl?: string;
  emailVerified: boolean;
  token: string;
  ratingsc?: Number;
  avgRating?: Number;

}
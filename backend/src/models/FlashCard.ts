// models/FlashCard.ts
import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IFlashcard extends Document {
  _id: ObjectId
  userId: mongoose.Types.ObjectId;
  words: string;
  means: string;
  createdAt: Date;
}

const FlashCardSchema = new Schema<IFlashcard>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  words: { type: String, required: true },
  means: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},
{timestamps:true}
);

export default mongoose.model<IFlashcard>("FlashCard", FlashCardSchema, 'FlashCard');

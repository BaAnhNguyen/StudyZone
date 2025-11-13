
import FlashCard, { IFlashcard } from "../models/FlashCard";
import mongoose from "mongoose";
import user from "../models/user";

export class FlashCardService {

    public static async createFlashCard(
        userId : string,
        word: string,
        means:string
    ): Promise<IFlashcard> {
         try {
            const newFlashCard = FlashCard.create({
            userId: new mongoose.Types.ObjectId(userId) ,
            word,
            means,
        })

        await user.findByIdAndUpdate(userId, {$inc: {total_card : 1}})

        return newFlashCard
         } catch (error) {
            throw new Error("Failed to create flashcard");
         }
    }

    }

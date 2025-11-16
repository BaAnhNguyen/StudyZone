import FlashCard, {IFlashcard} from "../models/FlashCard";
import mongoose, { Error } from "mongoose";


export class flashCardRepository{
    public static async getCardById(id : string){
        try {
            const flashCard = await FlashCard.findById(id)
            return flashCard
        } catch (error) {
            throw new Error('Không tìm thấy card')
        }
    }
}
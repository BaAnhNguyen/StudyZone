import FlashCard, {IFlashcard} from "../models/FlashCard";
import mongoose, { Error } from "mongoose";
import user from "../models/user";


export class flashCardService{
    public static async createFlashCard (
        userId: string,
        words: string,
        means: string
    ) : Promise<IFlashcard>{
        try {
            const newFlashCard = FlashCard.create({
                userId: new mongoose.Types.ObjectId(userId),
                words,
                means
            })

            await user.findByIdAndUpdate(userId, {$inc:{total_card: 1}})

            return newFlashCard

        } catch (error) {
            throw new Error('Không thể tạo được')
        }
    }



    public static async getCardByUserId(userId: string){
        try {
            const card  = await FlashCard.find({
                userId: new mongoose.Types.ObjectId(userId)
            }).sort({createAt : -1})

            return card
        } catch (error) {
            throw new Error('Không có flash card')
        }
    }

    public static async getCardById(userId: string){
        try {
            const card  = await FlashCard.find({
                userId: new mongoose.Types.ObjectId(userId)
            }).sort({createAt : -1})

            return card
        } catch (error) {
            throw new Error('Không có flash card')
        }
    }


    public static async updateFlashCard(
        flashCardId : string,
        words: string,
        means: string
    ): Promise<IFlashcard | null>{
        try {
            const updateCard = await FlashCard.findByIdAndUpdate(
                flashCardId,
                {words, means},
                {new: true}
            )
            return updateCard
        } catch (error) {
            throw new Error('Không thể cập nhật card')
        }
    }

    public static async deleteFlasCard(flashCardId: string, userId: string): Promise<boolean>{
        try {
            const flashCardDelete = await FlashCard.findOneAndDelete(
            {
                _id: flashCardId,
                userId : new mongoose.Types.ObjectId(userId)
            }
        )
           if(flashCardDelete){
                await user.findByIdAndUpdate(userId, {$inc:{total_card:-1}})
                return true
           }

           return false
    }

     catch (error) {
            throw new Error('Không theere xóa')
        }
}
}

import {UserRepository} from '../repository/userRepository'
import { IUser } from '../models/user'
import mongoose from 'mongoose'

export class userService {
    public static async updateProfile(id: string, data : Partial<IUser>){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Id không tồn tại');
        }

        const user = await UserRepository.findById(id)
            if(!user){
                throw new Error('User không tồn tại');
            }
        const updateData : Partial<IUser> = {}
         if(data.name)  updateData.name = data.name;
         if(data.phone) updateData.phone = data.phone;
         if(data.avatar) updateData.avatar = data.avatar;



         if(Object.keys(updateData).length === 0){
            throw new Error('Không có data để update')
         }

         const updatedUser = await UserRepository.updateById(id,updateData)

         return updatedUser

    }


    public static async getUserProfile(id: string){
         if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Id không tồn tại');
        }

        const user = await UserRepository.findById(id)

        if(!user){
            throw new Error('User không tồn tại');
        }


        return user

    }

}
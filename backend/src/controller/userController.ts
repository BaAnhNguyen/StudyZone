import { Router, Request, Response } from "express";
import {authenticateToken} from '../middleware/jwtMiddleware'
import { userService } from "../service/userService";
const router = Router()

router.patch('/update-profile/:id', authenticateToken, async(req:Request, res: Response) => {
   try {
     const {id} = req.params
    const {name, phone, avatar} = req.body

    const updateUser = await userService.updateProfile(id, {name, phone, avatar})

    return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        user : updateUser
    })

    
    
   } catch (error: any) {
      if (error.message === "Id không tồn tại" || error.message === "Không có data để update") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === "User không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }

    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
   }

})


router.get('/view-profile/:id',authenticateToken, async(req:Request, res: Response) =>{
   try {
     const {id} = req.params

    const user = await userService.getUserProfile(id)

    const userData = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,       
    }

    res.status(200).json({
      success: true,
      message: 'Xem profile thành công',
      data: userData
    })
   } catch (error : any) {
     if (error.message === "Id không tồn tại") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === "User không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
   }

)

export default router;
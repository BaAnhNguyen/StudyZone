import { flashCardService } from "../service/flashService";
import { Request, Response, Router } from "express";
import { authenticate } from "../middleware/authMiddleware";


const router = Router()

router.post('/create-card',
     authenticate, 
     async(req: Request, res: Response) => {
        try {
            // Lấy userId từ JWT hoặc Session
            const userId = req.jwtUser?.userId || (req.user as any)?._id || (req.user as any)?.id;
            
            if(!userId){
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy user'
                })
            }
            const {words, means}  = req.body

            if(!words || !means){
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền vào các field'
                })
            }

            const flashcard = await flashCardService.createFlashCard(userId, words, means)

            return res.status(201).json({
                success: true,
                message: 'Tạo thành công',
                data: flashcard
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            })
        }
})


router.get('/get-card', authenticate, async(req: Request, res: Response) => {
    try {
        const userId = req.jwtUser?.userId
         if(!userId){
            return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy user'
                })
            }
        
        const flashCard = await flashCardService.getCardByUserId(userId)
        
        return res.status(200).json({
            success: true,
            message: 'Lấy flash card thành công',
            data: flashCard
        })
        
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            })
    }
})


router.patch('/update-card/:id', authenticate, async(req:Request, res: Response) => {
    try {
        const userId = req.jwtUser?.userId
         if(!userId){
            return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy user'
                })
            }

        const {id} = req.params
        const {words, means} = req.body

        const flashCard = await flashCardService.updateFlashCard(id, words, means)
        
            if (!flashCard) {
                return res.status(404).json({ 
                    success: false,
                    message: "Không tìm  thấy flash card" 
                });
            }
        return res.status(200).json({
            success: true,
            message: 'Cập nhật flash card thành công',
            data: flashCard
        })
        
        
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            })       
    }
})


router.delete('/delete-card', authenticate, async(req: Request, res: Response) => {
    try {
        const userId = req.jwtUser?.userId
         if(!userId){
            return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy user'
                })
            }
            
        const {id} = req.params

        const flashCard = flashCardService.deleteFlasCard(id, userId)
            if (!flashCard) {
                return res.status(404).json({ 
                    success: false,
                    message: "Flashcard not found" 
                });
            }
            return res.status(200).json({
                success: true,
                message: "Flashcard deleted successfully"
            });                   
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            })            
    }
})


export default router
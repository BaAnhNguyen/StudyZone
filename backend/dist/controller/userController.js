"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtMiddleware_1 = require("../middleware/jwtMiddleware");
const userService_1 = require("../service/userService");
const router = (0, express_1.Router)();
router.patch('/update-profile/:id', jwtMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, avatar } = req.body;
        const updateUser = await userService_1.userService.updateProfile(id, { name, phone, avatar });
        return res.status(200).json({
            success: true,
            message: 'Cập nhật thành công',
            user: updateUser
        });
    }
    catch (error) {
        if (error.message === "Id không tồn tại" || error.message === "Không có data để update") {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message === "User không tồn tại") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});
router.get('/view-profile/:id', jwtMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService_1.userService.getUserProfile(id);
        const userData = {
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
        };
        res.status(200).json({
            success: true,
            message: 'Xem profile thành công',
            data: userData
        });
    }
    catch (error) {
        if (error.message === "Id không tồn tại") {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message === "User không tồn tại") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;

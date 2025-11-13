import app from './app';
import { connectDatabase } from './config/database';
import './config/passport'; // Import passport config

const PORT = process.env.PORT || 3000;

// Kết nối database
connectDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

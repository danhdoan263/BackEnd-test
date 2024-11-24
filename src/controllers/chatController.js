import { chatService } from '~/services/chatService';

// Tạo phòng chat mới
const createNew = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const data = {
      userId1: userId1,
      userId2: userId2,
    };
    console.log(data);

    // Kiểm tra và tạo phòng chat mới
    const room = await chatService.createNew(data);
    res.status(200).json({ response: room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gửi tin nhắn
const sendMessage = async (req, res) => {
  try {
    const { roomId, sender, message } = req.body;

    // Lưu tin nhắn vào database
    const newMessage = await chatService.saveMessage(roomId, sender, message);

    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tin nhắn trong phòng
const getMessages = async (req, res) => {
  try {
    const { roomId, limit, page } = req.query;
    const messages = await chatService.getMessagesByRoomId(roomId, limit, page);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const chatController = {
  createNew,
  sendMessage,
};

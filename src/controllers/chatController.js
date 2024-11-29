import { StatusCodes } from 'http-status-codes';
import { chatService } from '~/services/chatService';

// Tạo phòng chat mới
const createNew = async (req, res) => {
  try {
    const { user_id, otherUser_id } = req.body;

    const checkRoomExitBeforeCreate = await chatService.getRoomByUserId(
      user_id,
      otherUser_id
    );

    if (checkRoomExitBeforeCreate) {
      res.status(StatusCodes.OK).json({
        roomId: checkRoomExitBeforeCreate._id,
      });
    } else {
      const createNewRoom = await chatService.createNew(user_id, otherUser_id);

      if (createNewRoom) {
        res.status(StatusCodes.OK).json({
          message: 'create success',
          roomId: createNewRoom._id,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Gửi tin nhắn
const saveMessage = async (saveMessage) => {
  try {
    // Lưu tin nhắn vào database
    const { roomId, sender, newMessage, otherUser_id } = saveMessage;
    const saveNewMessage = await chatService.saveMessage(
      roomId,
      sender,
      newMessage,
      otherUser_id
    );
    console.log('saveMessage from controller', saveNewMessage);
  } catch (err) {
    console.log(err);
  }
};

// Lấy tin nhắn trong phòng
const getMessages = async (recieveData) => {
  try {
    const { sender, otherUser_id, roomId } = recieveData;

    const messages = await chatService.getMessagesByRoomId(roomId);
    return messages;
  } catch (err) {
    console.log(err.message);
  }
};

export const chatController = {
  createNew,
  saveMessage,
  getMessages,
};

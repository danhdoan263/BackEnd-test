import { messageModel } from '~/models/messageModel';
import { roomModel } from '~/models/roomModel';

const createNew = async (user_id, otherUser_id) => {
  console.log(user_id, otherUser_id, ' from service');

  if ((user_id || otherUser_id) === undefined || null) {
    return {
      code: 404,
      userId1: user_id,
      userId2: otherUser_id,
    };
  }

  const response = await roomModel.createNew(user_id, otherUser_id);
  console.log(response);

  return response;
};

const saveMessage = async (roomId, sender, newMessage, otherUser_id) => {
  const checkRoomExit = await roomModel.checkRoomExits(
    roomId,
    sender,
    otherUser_id
  );
  console.log('checkRoomExit from service', checkRoomExit);

  if (checkRoomExit) {
    const saveChatMessage = await messageModel.createNew(
      roomId,
      sender,
      newMessage
    );
    return saveChatMessage;
  }
  return checkRoomExit;
};

const getRoomByUserId = async (user_id, otherUser_id) => {
  return await roomModel.getRoomByUserId(user_id, otherUser_id);
};

const getMessagesByRoomId = async (roomId) => {
  return await messageModel.getMessage(roomId);
};

export const chatService = {
  createNew,
  getRoomByUserId,
  saveMessage,
  getMessagesByRoomId,
};

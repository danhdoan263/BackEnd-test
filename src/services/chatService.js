import { messageModel } from '~/models/messageModel';
import { roomModel } from '~/models/roomModel';

const createNew = async (data) => {
  const { userId1, userId2 } = data;
  console.log(data);

  if ((userId1 || userId2) === undefined || null) {
    return {
      code: 404,
      userId1: userId1,
      userId2: userId2,
    };
  }
  const response = await roomModel.createNew(data);
  console.log(response);

  return response;
};

const saveMessage = async (roomId, sender, message) => {
  const checkRoomExit = await roomModel.checkRoomExits(roomId, sender, message);

  if (checkRoomExit) {
    const saveChatMessage = await messageModel.createNew(
      roomId,
      sender,
      message
    );
    return saveChatMessage;
  }
  return checkRoomExit;
};

export const chatService = {
  createNew,
  saveMessage,
};

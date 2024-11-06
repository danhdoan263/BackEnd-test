import { ObjectId } from 'mongodb';

const Joi = require('joi');
const { GET_DB } = require('~/config/mongodb');
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require('~/utils/validators');

const POSTCOMMENT_COLLECTION_NAME = 'comment';
const POSTCOMMENT_COLLECTION_SCHEMA = Joi.object({
  post_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  user_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  comment: Joi.string().min(1).max(255).trim().strict(),
  replies: Joi.array()
    .items(
      Joi.object({
        parent_id: Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        comment: Joi.string().min(1).max(255).trim().strict(),
        post_id: Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        user_id: Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        created_at: Joi.date().timestamp().default(Date.now),
        updated_at: Joi.date().timestamp().default(Date.now),
        replies: Joi.array().items(Joi.link('#replySchema')).default([]), // Để lồng nhau nếu cần thiết
      }).id('replySchema')
    )
    .default([]),
  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(Date.now),
}).custom((value, helpers) => {
  const { post_id, replies } = value;

  // Kiểm tra tất cả các replies để đảm bảo post_id khớp với comment cha
  if (replies && replies.length > 0) {
    for (const reply of replies) {
      if (reply.post_id !== post_id) {
        return helpers.error('any.custom', {
          message:
            'post_id trong replies phải trùng với post_id của comment cha',
        });
      }
    }
  }

  return value; // Trả về value nếu tất cả các điều kiện đều hợp lệ
}, 'Custom post_id validation for replies');

const POSTREPLIES_COLLECTION_SCHEMA = Joi.object({
  parent_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  comment: Joi.string().min(1).max(255).trim().strict(),
  post_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  user_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  created_at: Joi.date().timestamp().default(Date.now),
  updated_at: Joi.date().timestamp().default(Date.now),
});

const validateComment = async (data) => {
  return await POSTCOMMENT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  const validData = await validateComment(data);

  return await GET_DB()
    .collection(POSTCOMMENT_COLLECTION_NAME)
    .insertOne(validData);
};

const createNewReply = async (data) => {
  console.log(data);
  const validdata = await POSTREPLIES_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
  console.log(validdata);

  return await GET_DB()
    .collection(POSTCOMMENT_COLLECTION_NAME)
    .updateOne(
      { post_id: data.post_id },
      {
        $push: {
          replies: {
            validdata,
          },
        },
      }
    );
};

const findOneComment = async (id) => {
  const idx = new ObjectId(id);

  const response = await GET_DB()
    .collection(POSTCOMMENT_COLLECTION_NAME)
    .findOne({
      _id: idx,
    });
  return response;
};
const findAllComment = async () => {
  const response = await GET_DB()
    .collection(POSTCOMMENT_COLLECTION_NAME)
    .find({})
    .toArray();
  return response;
};
const findCommentByPostId = async (id) => {
  const response = await GET_DB()
    .collection(POSTCOMMENT_COLLECTION_NAME)
    .find({
      post_id: id,
    })
    .toArray();
  return response;
};

export const postCommentModel = {
  createNew,
  createNewReply,
  findOneComment,
  findAllComment,
  findCommentByPostId,
};

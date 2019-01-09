//import * as mongoose from 'mongoose';
import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IDocument extends Document {
  user?: String;
  title?: String;
  type?: String;
  content?: String;
  createdAt?: Date;
  updatedAt?: Date;
  description?: String;
}

const DocumentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  title: {
    type: String,
    trim: true,
  },

  type: {
    type: String,
    required: true,
  },

  content: {
    //type: JSON,
    type: String,
    trim: true,
  },

  description: {
    type: String,
  },

  versions: [
    {
      //content: JSON,
      type: String,
      date: Date,
      id: Number,
    },
  ],

  exercise: [
    {
      //content: JSON,
      type: String,
      date: Date,
      id: Number,
    },
  ],
});

DocumentMongSchema.plugin(timestamps);
export const DocumentModel: Model<IDocument> = model<IDocument>(
  'DocumentModel',
  DocumentMongSchema,
);

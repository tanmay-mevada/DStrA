import mongoose, { Schema } from 'mongoose';

const snippetSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
  title: String,
  language: String,
  code: String,
  createdAt: { type: Date, default: Date.now },
});

export const Snippet = mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

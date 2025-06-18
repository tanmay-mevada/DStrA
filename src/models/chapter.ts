import mongoose, { Schema } from 'mongoose';

const chapterSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);

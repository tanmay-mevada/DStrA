import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chapterNumber: { type: Number, required: true, min: 1 },
    algorithm: { type: String, required: true },
    codes: {
      c: { type: String },
      cpp: { type: String },
      python: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Library || mongoose.model('Library', LibrarySchema);

import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chapterNumber: { type: Number, required: true },
    language: { type: String, default: 'python' },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    code: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);

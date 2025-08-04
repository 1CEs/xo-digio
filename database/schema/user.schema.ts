import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IHistory, IMove, IGameSetting } from './user.interface';

const gameSettingSchema = new Schema<IGameSetting>({
  duration: { type: Number, required: true },
  boardRows: { type: Number, required: true, min: 3, max: 10 },
  boardCols: { type: Number, required: true, min: 3, max: 10 },
  aiDifficulty: { 
    type: String, 
    required: true, 
    enum: ['easy', 'medium', 'hard'] 
  }
});

const moveSchema = new Schema<IMove>({
  playerId: { 
    type: String, 
    required: true, 
    enum: ['st', 'nd', 'bot'] 
  },
  symbol: { 
    type: String, 
    required: true, 
    enum: ['X', 'O'] 
  },
  position: {
    row: { type: Number, required: true },
    col: { type: Number, required: true }
  },
  timestamp: { type: Date, required: true, default: Date.now },
  moveNumber: { type: Number, required: true }
});

const historySchema = new Schema<IHistory>({
  id: { type: String, required: true },
  gameStatus: { 
    type: String, 
    required: true, 
    enum: ['completed', 'abandoned', 'in_progress'] 
  },
  winner: { 
    type: String, 
    enum: ['st', 'nd', 'draw', 'bot'], 
    default: null 
  },
  gameSetting: { type: gameSettingSchema, required: true },
  moves: [moveSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: true,
      minlength: 8
    },
    avatar: { 
      type: String, 
      default: '' 
    },
    history: [historySchema]
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  history: IHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
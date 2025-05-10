import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ['user', 'admin', 'system_admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },

    password: { type: String, required: true, select: false },

    role: { type: String, enum: ROLES, default: 'user' },
  },
  { timestamps: true }
);

// Instance method to validate credentials
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Control JSON output
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, obj) => {
    delete obj._id;
    delete obj.password;
    return obj;
  },
});

export default mongoose.model('User', userSchema);

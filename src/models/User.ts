import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Auth
  image: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'user' 
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = models.User || model('User', UserSchema);

export default User;

import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { BASE_SCHEMA } from './BaseSchema.ts';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true, // Throws a duplicate key error if the email already exists in the database
    maxLength: 254,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        return validator.isEmail(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [12, 'The password must be a minimum length of 12 characters.'],
    maxLength: [256, 'The password must be a maximum length of 256 characters.']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // Throws a duplicate key error if the username already exists in the database
    minLength: [3, 'The username must be a minimum length of 3 characters.'],
    maxLength: [32, 'The username must be a maximum length of 32 characters.'],
    lowercase: false,
    trim: true
  }
}, {});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.add(BASE_SCHEMA);

export const UserModel = mongoose.model('User', userSchema);

import { Schema, Model, model } from 'mongoose';
import validator from 'validator';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { BASE_SCHEMA } from './baseSchema.ts';
import { Counter } from './Counter.ts';

interface ExtendedUser extends Model<IUser> {
  authenticate(email: string, pw: string): boolean;
}

const userSchema = new Schema<IUser, ExtendedUser>({
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
  },
  userId: {
    type: Number
  }
}, {});

userSchema.pre('save', async function () {
  const bcrypt = container.get<BcryptWrapper>(TYPES.BcryptWrapper);
  this.password = await bcrypt.hashPassword(this.password, 12);
});

userSchema.pre('save', async function (next) {
  if (this.isNew) { // Check if the document is new
    const count = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = count.seq;
  }
  next();
});

userSchema.add(BASE_SCHEMA);
export const UserModel = model<IUser, ExtendedUser>('User', userSchema);

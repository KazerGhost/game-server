import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 8
    },
    password: {
        type: String,
        trim: true,
    }
});

userSchema.plugin(passportLocalMongoose);

export const User = mongoose.model('User', userSchema) as any;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Imię jest wymagane.'],
        },
        lastName: {
            type: String,
            required: [true, 'Nazwisko jest wymagane.'],
        },
        email: {
            type: String,
            required: [true, 'Adres email jest wymagany.'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Hasło jest wymagane.'],
            minlength: [6, 'Hasło musi mieć co najmniej 6 znaków.'],
        },
        role: {
            type: String,
            enum: ['User', 'Admin'],
            default: 'User',
        },
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Team',
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema ({
    cost: {
        type: Number,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'verified'],
        default: 'pending'
    },
    proof: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const memberSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    }
});

const groupSchema=new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: [memberSchema],
    expenses: [expenseSchema]
});

const userSchema=new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    groups: [{
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }]
});

const User=mongoose.model('User', userSchema);
const Group=mongoose.model('Group', groupSchema);

export {User, Group};
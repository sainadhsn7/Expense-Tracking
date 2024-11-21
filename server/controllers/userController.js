import { User, Group } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};


export const addMember = async (req, res) => {
    const { email, groupId } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const isMember = group.members.some(member => member.user.equals(user._id));
        if (isMember) {
            return res.status(400).json({ message: 'User is already a part of the group.' });
        }

        group.members.push({ user: user._id, role: 'member' });
        await group.save();

        user.groups.push({ group: group._id, role: 'member' });
        await user.save();

        res.status(200).json({ message: 'User added to the group successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member to group', error });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const memberIndex = group.members.findIndex(member => member.user.toString() === userId);
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'User not found in group.' });
        }

        group.members.splice(memberIndex, 1);

        await group.save();

        res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Failed to remove member.' });
    }
};

export const getUserRoleInGroup = async (req, res) => {
    const { userId, groupId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const groupEntry = user.groups.find(groupEntry => groupEntry.group.toString() === groupId);
        if (!groupEntry) {
            return res.status(404).json({ message: 'User is not a member of this group.' });
        }

        res.status(200).json({ role: groupEntry.role });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Failed to fetch user role.', error });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required.' });
        }

        await User.findByIdAndUpdate(
            userId,
            { $pull: { groups: { group: groupId } } },
            { new: true }
        );

        await Group.findByIdAndUpdate(
            groupId,
            { $pull: { members: { user: userId } } },
            { new: true }
        );

        res.status(200).json({ message: 'Successfully left the group.' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ message: 'Failed to leave the group.' });
    }
};
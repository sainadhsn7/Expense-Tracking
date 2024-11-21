import {User, Group} from '../models/userModel.js';

export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        if (!name || !description) {
            return res.status(400).json({ message: 'Group name and description are required.' });
        }

        const newGroup = new Group({
            name,
            description,
            members: [{ user: userId, role: 'admin' }]
        });

        await newGroup.save();

        await User.findByIdAndUpdate(userId, {
            $push: { groups: { group: newGroup._id, role: 'admin' } }
        });

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'groups.group',
                select: 'name description'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.groups || user.groups.length === 0) {
            return res.status(200).json({ message: 'User is part of no groups.' });
        }

        const groups = user.groups
            .filter(group => group.group)
            .map(group => ({
                ...group.group._doc,
                _id: group.group._id,
                role: group.role
            }));

        if (groups.length === 0) {
            return res.status(200).json({ message: 'User is part of no groups.' });
        }

        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Error fetching user groups', error });
    }
};

export const getGroupDetails = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        const group = await Group.findById(groupId)
            .populate({
                path: 'members.user',
                select: 'name email',
            });

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group details', error });
    }
};

export const deleteGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      const userGroup = group.members.find(member => member.user.toString() === userId && member.role === 'admin');
      if (!userGroup) {
        return res.status(403).json({ message: 'User is not authorized to delete this group' });
      }
  
      await User.updateMany(
        { 'groups.group': groupId },
        { $pull: { groups: { group: groupId } } }
      );
  
      await Group.findByIdAndDelete(groupId);
  
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
};
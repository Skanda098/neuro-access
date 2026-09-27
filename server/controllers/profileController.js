import UserProfile from '../models/UserProfile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: 'default-user' });
    if (!profile) {
      profile = await UserProfile.create({ userId: 'default-user' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile settings.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: 'default-user' },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile settings.' });
  }
};
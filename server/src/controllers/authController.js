import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const user = await User.create({ name, email, password, role: 'customer' });
  res.status(201).json({
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      shippingAddresses: req.user.shippingAddresses,
      createdAt: req.user.createdAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;

  if (name != null && String(name).trim()) {
    req.user.name = String(name).trim();
  }

  if (email != null) {
    const nextEmail = String(email).trim().toLowerCase();
    if (nextEmail && nextEmail !== req.user.email) {
      const taken = await User.findOne({ email: nextEmail, _id: { $ne: req.user._id } });
      if (taken) {
        res.status(400);
        throw new Error('Email already in use');
      }
      req.user.email = nextEmail;
    }
  }

  if (avatar !== undefined) req.user.avatar = avatar;
  await req.user.save();
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
});

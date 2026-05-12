import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { recalcProductRating } from '../utils/recalcProductRating.js';

export const listProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const addOrUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment = '' } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  let review = await Review.findOne({ product: product._id, user: req.user._id });
  if (review) {
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating,
      comment,
    });
  }
  await recalcProductRating(product._id);
  await review.populate('user', 'name avatar');
  res.status(review.createdAt === review.updatedAt ? 201 : 200).json(review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed');
  }
  const pid = review.product;
  await review.deleteOne();
  await recalcProductRating(pid);
  res.json({ message: 'Review removed' });
});

import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';

export async function recalcProductRating(productId) {
  const agg = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const row = agg[0];
  await Product.findByIdAndUpdate(productId, {
    rating: row ? Math.round(row.avg * 10) / 10 : 0,
    numReviews: row ? row.count : 0,
  });
}

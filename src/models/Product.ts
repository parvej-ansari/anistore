import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }],
  affiliateLink: { type: String, required: true },
  platform: { type: String, required: true },
  category: { type: String, required: true },
}, {
  timestamps: true,
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;

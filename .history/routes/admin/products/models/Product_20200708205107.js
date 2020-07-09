const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String },
  price: { type:Number },
  image: {type: String },
  description: {type: String
});

module.exports = mongoose.model('Product', ProductSchema);

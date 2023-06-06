const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    created_at: {type: Date, default: Date.now},
    userId : {
      type : Schema.Types.ObjectId,
      ref : 'User'
    }
  });

  module.exports = mongoose.model('Product', productSchema);
  
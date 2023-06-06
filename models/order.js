const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
        amount : {
            type : Number
        },
        quantity : {
            type : Number
        },
        items : {
            type : Number
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : 'User',
        }
  });

  module.exports = mongoose.model('Order', orderSchema);
  
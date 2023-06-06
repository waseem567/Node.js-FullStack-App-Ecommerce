const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    cart : {
      items : [{
        productId : {
        type : Schema.Types.ObjectId,
        ref : 'Product',
        required : true
      },
      quantity : {
        type : Number,
        required : true
      }
      }]
    }
  });
  
userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.deleteFromCart = function(product) {
  const deleteProduct = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  if(this.cart.items[deleteProduct].quantity > 1){
    this.cart.items[deleteProduct].quantity -= 1;
    return this.save();
  }
  else{
    const cartProds = [...this.cart.items]
    cartProds.splice(deleteProduct , 1);
    const cart = {
      items: cartProds
    };
    this.cart = cart;
    return this.save();
  }
 
}
  userSchema.methods.clearCart = function() {
    let cart = {
      items : []
    }
    this.cart = cart; 
    return this.save();
}

  module.exports = mongoose.model('User', userSchema);
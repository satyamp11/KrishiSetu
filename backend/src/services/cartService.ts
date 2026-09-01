import mongoose from 'mongoose';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

export interface CartPopulatedItem {
  productId: string;
  title: string;
  category: string;
  price: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  farmerId: string;
  farmerName: string;
  fpoName?: string;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  success: boolean;
  totalItems: number;
  subtotalAmount: number;
  items: CartPopulatedItem[];
  message?: string;
}

export const cartService = {
  // 1. Get Populated User Cart (Totals Calculated strictly on Backend)
  async getCart(userId: string): Promise<CartResponse> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, totalItems: 0, subtotalAmount: 0, items: [], message: 'Invalid user ID' };
    }

    let userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userCart) {
      userCart = new Cart({ userId: new mongoose.Types.ObjectId(userId), items: [] });
      await userCart.save();
    }

    const populatedItems: CartPopulatedItem[] = [];
    let subtotalAmount = 0;
    let totalItems = 0;

    for (const item of userCart.items) {
      const product = await Product.findById(item.productId);
      if (product && product.status !== 'unlisted') {
        const itemPrice = product.price;
        const validQuantity = Math.min(item.quantity, product.availableQuantity || 1);
        const itemSubtotal = itemPrice * validQuantity;

        subtotalAmount += itemSubtotal;
        totalItems += validQuantity;

        populatedItems.push({
          productId: product._id.toString(),
          title: product.title,
          category: product.category,
          price: itemPrice,
          unit: product.unit,
          availableQuantity: product.availableQuantity,
          imageUrl: product.imageUrl,
          farmerId: product.farmerId ? product.farmerId.toString() : '',
          farmerName: product.farmerName,
          fpoName: product.fpoName || '',
          quantity: validQuantity,
          subtotal: itemSubtotal
        });
      }
    }

    return {
      success: true,
      totalItems,
      subtotalAmount,
      items: populatedItems
    };
  },

  // 2. Add Item to Cart (Stock Validated on Backend)
  async addToCart(userId: string, productId: string, requestedQuantity: number): Promise<CartResponse> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return { success: false, totalItems: 0, subtotalAmount: 0, items: [], message: 'Invalid product ID.' };
    }

    const product = await Product.findById(productId);
    if (!product || product.status === 'unlisted') {
      return { success: false, totalItems: 0, subtotalAmount: 0, items: [], message: 'Product unavailable.' };
    }

    // Backend Stock Validation
    if (product.availableQuantity < 1) {
      return { success: false, totalItems: 0, subtotalAmount: 0, items: [], message: 'Item is currently out of stock.' };
    }

    let userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userCart) {
      userCart = new Cart({ userId: new mongoose.Types.ObjectId(userId), items: [] });
    }

    const existingIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const qtyToAdd = requestedQuantity > 0 ? requestedQuantity : 1;

    if (existingIndex > -1) {
      const newQty = userCart.items[existingIndex].quantity + qtyToAdd;
      if (newQty > product.availableQuantity) {
        return {
          success: false,
          totalItems: 0,
          subtotalAmount: 0,
          items: [],
          message: `Cannot add more. Only ${product.availableQuantity} ${product.unit} available in stock.`
        };
      }
      userCart.items[existingIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.availableQuantity) {
        return {
          success: false,
          totalItems: 0,
          subtotalAmount: 0,
          items: [],
          message: `Cannot add. Only ${product.availableQuantity} ${product.unit} available in stock.`
        };
      }
      userCart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity: qtyToAdd
      });
    }

    await userCart.save();
    return await this.getCart(userId);
  },

  // 3. Update Cart Item Quantity (Stock Validated on Backend)
  async updateQuantity(userId: string, productId: string, newQuantity: number): Promise<CartResponse> {
    if (newQuantity <= 0) {
      return await this.removeItem(userId, productId);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, totalItems: 0, subtotalAmount: 0, items: [], message: 'Product not found.' };
    }

    if (newQuantity > product.availableQuantity) {
      return {
        success: false,
        totalItems: 0,
        subtotalAmount: 0,
        items: [],
        message: `Exceeds stock limit. Only ${product.availableQuantity} ${product.unit} available.`
      };
    }

    const userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userCart) {
      return await this.getCart(userId);
    }

    const itemIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      userCart.items[itemIndex].quantity = newQuantity;
      await userCart.save();
    }

    return await this.getCart(userId);
  },

  // 4. Remove Item from Cart
  async removeItem(userId: string, productId: string): Promise<CartResponse> {
    const userCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (userCart) {
      userCart.items = userCart.items.filter(
        (item) => item.productId.toString() !== productId
      );
      await userCart.save();
    }
    return await this.getCart(userId);
  },

  // 5. Clear Cart
  async clearCart(userId: string): Promise<void> {
    await Cart.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { items: [] } }
    );
  }
};

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button, Badge, useToast } from '../ui';
import { apiService, CartResponse, CartPopulatedItem } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlacedSuccess?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderPlacedSuccess = () => {},
}) => {
  const { user, token, openAuthModal } = useAuth();
  const toast = useToast();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  // Address State for Checkout
  const [streetAddress, setStreetAddress] = useState<string>(user?.deliveryAddress?.streetAddress || '');
  const [city, setCity] = useState<string>(user?.deliveryAddress?.city || user?.district || 'Gorakhpur');
  const [stateName, setStateName] = useState<string>(user?.deliveryAddress?.state || user?.state || 'Uttar Pradesh');
  const [pincode, setPincode] = useState<string>(user?.deliveryAddress?.pincode || '273001');

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiService.getCart(token);
      if (res.success) {
        setCart(res);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchCart();
    }
  }, [isOpen, token]);

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    if (!token) return;
    const res = await apiService.updateCartQuantity(token, productId, newQty);
    if (res.success) {
      setCart(res);
    } else {
      toast.error('Cart Update Error', res.message || 'Unable to update item.');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!token) return;
    const res = await apiService.removeCartItem(token, productId);
    if (res.success) {
      setCart(res);
      toast.info('Item Removed', 'Produce item removed from cart.');
    }
  };

  const handleCheckout = async () => {
    if (!user || !token) {
      toast.info('Authentication Required', 'Please sign in to complete your purchase.');
      openAuthModal('login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.warning('Empty Cart', 'Your cart is empty.');
      return;
    }

    if (!streetAddress.trim() || !city.trim() || !pincode.trim()) {
      toast.error('Address Required', 'Please complete delivery street address, city, and pincode.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await apiService.createOrder(token, {
        deliveryAddress: {
          streetAddress,
          city,
          state: stateName,
          pincode,
        },
        paymentMethod: 'ESCROW',
      });

      if (res.success && res.orders) {
        toast.success('Order Placed!', `Created ${res.orders.length} direct trade order(s) with Escrow Protection.`);
        fetchCart();
        onClose();
        onOrderPlacedSuccess();
      } else {
        toast.error('Order Placement Failed', res.message || 'Unable to place order.');
      }
    } catch (err) {
      toast.error('Error', 'Network error during checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isOpen) return null;

  const logisticsFee = (cart?.subtotalAmount || 0) > 5000 ? 0 : 150;
  const grandTotal = (cart?.subtotalAmount || 0) + (cart?.items.length ? logisticsFee : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Direct Produce Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Cart Items List */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
            {!user && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                <p className="text-xs text-amber-900 font-bold">Please sign in to view and manage your cart.</p>
                <Button variant="primary" size="sm" onClick={() => openAuthModal('login')}>
                  Sign In / Register
                </Button>
              </div>
            )}

            {user && loading && (
              <div className="text-center py-10 text-xs font-bold text-slate-400">Loading cart...</div>
            )}

            {user && !loading && cart && cart.items.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse fresh crop produce direct from verified farmers on the marketplace.
                </p>
              </div>
            )}

            {user && !loading && cart && cart.items.length > 0 && (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.productId} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-slate-400 hover:text-red-600 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-500 font-semibold">{item.fpoName || item.farmerName}</p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-emerald-800">
                          ₹{item.price} / {item.unit}
                        </span>

                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-black">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Delivery Address Form */}
                <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 space-y-2 mt-4">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Delivery Address</span>
                  </h4>

                  <input
                    type="text"
                    placeholder="Street Address, Sector, Village"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City / District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {user && cart && cart.items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Produce Subtotal:</span>
                  <span className="font-bold">₹{cart.subtotalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Logistics & Route Dispatch:</span>
                  <span className="font-bold">{logisticsFee === 0 ? 'FREE' : `₹${logisticsFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-800">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}>
                100% Escrow Direct Farmer Payment Protected
              </Badge>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                isLoading={checkoutLoading}
                onClick={handleCheckout}
              >
                Place Order (Escrow Deposit)
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

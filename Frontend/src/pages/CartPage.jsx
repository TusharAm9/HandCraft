import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserAddressThunk,
  getUserAddressThunk,
  getUserCartThunk,
  removeItemThunk,
  verifyRazorpayPaymentThunk,
  createRazorpayOrderThunk,
  updateCartQuantityThunk,
} from "../store/thunk/userThunk";
import {
  ShoppingCart,
  Trash2,
  MapPin,
  Edit,
  ArrowLeft,
  Lock,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import AddressForm from "../components/items/AddressForm";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, userAddresses, screenLoading, addedAddress } = useSelector(
    (state) => state.userSlice
  );
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      dispatch(removeItemThunk({ productId }));
    } else {
      dispatch(updateCartQuantityThunk({ productId, quantity }));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product || typeof item.product.price !== "number") return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      if (!selectedAddress || !selectedAddress.street) {
        toast.error("Please provide shipping address");
        return;
      }
      // Prepare order data BEFORE creating Razorpay order
      const orderData = {
        itemList: cartItems.map((item) => ({
          productId: item.productId || item.product?._id,
          productName: item.product?.name,
          price: item.product?.price,
          quantity: item.quantity,
          totalPrice: item.product?.price * item.quantity,
        })),
        totalAmount: total,
        customerAddress: {
          name: selectedAddress.name,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phone: selectedAddress.phone,
        },
      };
      const result = await dispatch(
        createRazorpayOrderThunk({ amount: total })
      ).unwrap();
      if (result) {
        openRazorpayCheckout(result, orderData);
      }
    } catch (err) {
      console.error("Checkout error", err);
    }
  };

  const openRazorpayCheckout = (order, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_aphZO7WuN44cdc",
      amount: order.amount,
      currency: "INR",
      name: "Artician Crafts",
      description: "Payment",
      order_id: order.orderId,
      handler: function (response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;

        const paymentData = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderData,
        };

        dispatch(verifyRazorpayPaymentThunk(paymentData))
          .unwrap()
          .then((res) => {
            navigate("/success");
          })
          .catch((err) => {
            console.log(err);
            console.error("❌ Payment Verification Failed:", err);
          });
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    dispatch(getUserCartThunk());
    dispatch(getUserAddressThunk());
  }, [addedAddress]);

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <a
            href="/all-products"
            className="hover:text-amber-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </a>
          <span>/</span>
          <span className="text-amber-700">Shopping Cart</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <a href="/">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
                Start Shopping
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <MapPin className="h-5 w-5" /> Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showAddressForm ? (
                    <>
                      {userAddresses?.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {userAddresses.map((addr, idx) => (
                            <div
                              key={idx}
                              className={`p-3 border rounded-md cursor-pointer transition-all ${
                                selectedAddress?.phone === addr.phone
                                  ? "border-amber-700 bg-amber-100"
                                  : "border-gray-300"
                              }`}
                              onClick={() => setSelectedAddress(addr)}
                            >
                              <p className="font-medium">{addr.name}</p>
                              <p className="text-sm text-gray-600">
                                {addr.street}, {addr.city}, {addr.state} -{" "}
                                {addr.zipCode}, {addr.country}
                              </p>
                              <p className="text-sm text-gray-600">
                                Phone: {addr.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show selected address */}
                      {selectedAddress ? (
                        <div className="mb-4">
                          <p className="font-medium">{selectedAddress.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.street}, {selectedAddress.city},{" "}
                            {selectedAddress.state} - {selectedAddress.zipCode},{" "}
                            {selectedAddress.country}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {selectedAddress.phone}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          No address selected
                        </p>
                      )}

                      <Button
                        onClick={() => setShowAddressForm(true)}
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Add / Edit Address
                      </Button>
                    </>
                  ) : (
                    <AddressForm
                      newAddress={newAddress}
                      handleInputChange={handleInputChange}
                      onSave={async () => {
                        try {
                          const res = await dispatch(
                            addUserAddressThunk(newAddress)
                          ).unwrap();
                          setSelectedAddress(res);
                          setShowAddressForm(false);
                        } catch (error) {
                          console.error("Address Add Error:", error);
                        }
                      }}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-900">Order Items</CardTitle>
                </CardHeader>
                {screenLoading ? (
                  <div className="text-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-amber-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <CardContent className="space-y-4">
                    {cartItems?.length > 0 ? (
                      cartItems.map((item, index) =>
                        item?.product ? (
                          <div key={item._id}>
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                      {item.product.name}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className="text-xs mb-2"
                                    >
                                      {item.product.category}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-amber-700">
                                        ₹{item.product.price}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <div className="flex items-center border border-amber-200 rounded-md">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            item.quantity - 1
                                          )
                                        }
                                        className="h-8 w-8"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="px-3 py-1 text-sm font-medium">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            item.quantity + 1
                                          )
                                        }
                                        className="h-8 w-8"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() =>
                                        updateQuantity(item._id, 0)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-2 text-right">
                                  <span className="font-semibold text-gray-900">
                                    ₹
                                    {(
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {index < cartItems.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        ) : null
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Your cart is empty.
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-amber-900">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-amber-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <Lock className="h-4 w-4 mr-2" /> Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

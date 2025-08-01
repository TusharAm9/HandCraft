import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersThunk, addReviewThunk } from "../store/thunk/userThunk";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const StarRating = ({ rating, setRating }) => {
  return (
    <div
      className="flex items-center gap-2"
      role="radiogroup"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="cursor-pointer"
          onClick={() => setRating(star)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setRating(star);
          }}
          tabIndex={0}
          role="radio"
          aria-checked={star <= rating}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-7 w-7 transition-colors duration-150 ${
              star <= rating ? "text-amber-500" : "text-yellow-300"
            }`}
            fill={star <= rating ? "#f59e42" : "none"}
            stroke={star <= rating ? "#f59e42" : "#fde68a"}
          />
        </span>
      ))}
      <span className="ml-3 text-amber-700 font-medium text-lg">
        {rating > 0 ? rating : ""}
      </span>
    </div>
  );
};

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { userOrders, screenLoading } = useSelector((state) => state.userSlice);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);
  const handleInputChange = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  // Submit review for one product
  const handleReviewSubmit = async (productId) => {
    const review = reviews[productId];
    if (!review?.rating || !review?.comment || review.comment.trim() === "") {
      alert("Please provide both a rating and a comment before submitting.");
      return;
    }

    try {
      await dispatch(
        addReviewThunk({
          productId,
          rating: review.rating,
          comment: review.comment.trim(),
        })
      ).unwrap();
      toast.success("Review submitted successfully.");
      setReviews((prev) => {
        const newReviews = { ...prev };
        delete newReviews[productId];
        return newReviews;
      });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-amber-900 mb-8">Your Orders</h2>

        {screenLoading ? (
          <div className="text-center" role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin fill-amber-400"
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
        ) : userOrders.length === 0 ? (
          <p className="text-gray-600 text-center">No past orders found.</p>
        ) : (
          userOrders.map((order) => {
            const canReview = order.orderStatus.toLowerCase() === "delivered";

            return (
              <Card key={order._id} className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-900 flex justify-between items-center">
                    <div>
                      Order ID:{" "}
                      <span className="font-mono">{order.orderId}</span>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-sm">
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                      <Badge className="ml-2 text-sm bg-amber-200 text-amber-900">
                        {order.orderStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {order.itemList.map((item) => {
                    const productId = item.productId?._id;
                    if (!productId) return null;
                    const review = reviews[productId] || {};

                    return (
                      <div
                        key={item._id}
                        className="border rounded-md p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.productId?.images?.[0]?.url}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.productName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ₹{item.price}
                            </p>
                            <p className="font-medium text-amber-800">
                              Total: ₹{item.totalPrice}
                            </p>
                            {canReview && (
                              <div className="mt-4 border-t pt-4">
                                <p className="font-semibold text-amber-900 mb-2">
                                  Rate this product
                                </p>
                                <StarRating
                                  rating={review.rating || 0}
                                  setRating={(value) =>
                                    handleInputChange(
                                      productId,
                                      "rating",
                                      value
                                    )
                                  }
                                />
                                {review.rating && (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleReviewSubmit(productId);
                                    }}
                                    className="mt-3 flex flex-col gap-2"
                                  >
                                    <label
                                      htmlFor={`comment-${productId}`}
                                      className="text-amber-900 font-medium"
                                    >
                                      Add a Review
                                    </label>
                                    <textarea
                                      id={`comment-${productId}`}
                                      value={review.comment || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          productId,
                                          "comment",
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-amber-300 p-2 resize-y focus:outline-amber-400"
                                      rows={3}
                                      placeholder="Write your review here..."
                                      required
                                    />
                                    <button
                                      type="submit"
                                      className="self-start bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-md transition"
                                    >
                                      Submit Review
                                    </button>
                                  </form>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Separator />

                  <div className="text-sm text-gray-700">
                    <p className="mb-1 font-semibold">Shipping Address:</p>
                    <p>
                      {order.customerAddress.street},{" "}
                      {order.customerAddress.city},{" "}
                      {order.customerAddress.state} -{" "}
                      {order.customerAddress.zipCode}
                    </p>
                    <p>Phone: {order.customerAddress.phone}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-amber-900">
                      Total Paid: ₹{order.totalAmount}
                    </span>
                    <span className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

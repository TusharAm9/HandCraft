import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersThunk } from "../store/thunk/userThunk";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { userOrders, screenLoading } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-amber-900 mb-8">Your Orders</h2>

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
        ) : userOrders.length === 0 ? (
          <p className="text-gray-600 text-center">No past orders found.</p>
        ) : (
          userOrders.map((order) => (
            <Card key={order._id} className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900 flex justify-between items-center">
                  <div>
                    Order ID: <span className="font-mono">{order.orderId}</span>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.itemList.map((item) => (
                    <div key={item._id} className="flex items-start gap-4">
                      <img
                        src={item.productId?.images?.[0]?.url}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                        <p className="font-medium text-amber-800">
                          Total: ₹{item.totalPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="text-sm text-gray-700">
                  <p className="mb-1 font-semibold">Shipping Address:</p>
                  <p>
                    {order.customerAddress.street}, {order.customerAddress.city}
                    , {order.customerAddress.state} -{" "}
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
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

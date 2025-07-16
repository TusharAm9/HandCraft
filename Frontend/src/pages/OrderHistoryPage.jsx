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
          <p className="text-gray-600 text-center">screenLoading orders...</p>
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

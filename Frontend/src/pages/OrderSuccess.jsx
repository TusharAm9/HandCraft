import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <Card className="max-w-xl w-full text-center shadow-lg border border-amber-200 bg-white">
        <CardHeader>
          <CheckCircle className="text-green-600 mx-auto h-16 w-16" />
          <CardTitle className="text-2xl text-amber-900 mt-4">
            Order Placed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Thank you for your purchase. We’ve received your order and are
            preparing it for shipment.
          </p>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link to="/">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/my-orders">
              <Button
                variant="outline"
                className="border-amber-700 text-amber-700 hover:bg-amber-50"
              >
                View My Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;

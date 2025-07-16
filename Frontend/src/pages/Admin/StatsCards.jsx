import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersThunk } from "../../store/thunk/adminThunk";

const StatsCards = () => {
  const dispatch = useDispatch();
  const { totalOrders, products, orders } = useSelector(
    (state) => state.adminSlice
  );
  const totalProducts = Array.isArray(products) ? products.length : 0;
  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((sum, order) => sum + order.totalAmount, 0)
    : 0;
  const lowStockProducts = 0;

  useEffect(() => {
    dispatch(getAllOrdersThunk());
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">
            ₹{totalRevenue}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">
            {totalProducts}
          </div>
          <p className="text-xs text-amber-600">Active inventory</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          <Users className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {lowStockProducts}
          </div>
          <p className="text-xs text-red-600">Products below 10 units</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;

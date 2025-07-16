import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import OrdersTable from "./OrdersTable";
import ProductsTable from "./ProductsTable";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <StatsCards />
        <OrdersTable />
        <ProductsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;

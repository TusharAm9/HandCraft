import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartThunk } from "../../store/thunk/productThunk";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId) => {
    dispatch(addToCartThunk({ productId, quantity: 1 }));
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative overflow-hidden">
        <Link to={`/${product._id}`}>
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
          )}
          {product.isSale && (
            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart
            className={`h-4 w-4 ${
              wishlistItems.includes(product.id)
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-700">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {product?._id && (
            <Link to={`/${product._id}`}>
              <Button
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                View More
              </Button>
            </Link>
          )}

          <Button
            className="flex-1 bg-amber-700 hover:bg-amber-800"
            onClick={() => addToCart(product._id)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

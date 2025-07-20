import { useEffect, useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, registerUserThunk } from "../store/thunk/userThunk";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.userSlice);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    gender: "male",
    email: "",
    confirmPassword: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      const updated = { ...prev, [name]: value };
      if (!isLogin && (name === "firstName" || name === "lastName")) {
        updated.fullName = `${updated.firstName || ""} ${
          updated.lastName || ""
        }`.trim();
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (userData.password !== userData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const registerResponse = await dispatch(registerUserThunk(userData));
      if (registerResponse.payload?.success) {
        navigate("/");
      }
      return;
    }

    // Only send email and password
    const loginResponse = await dispatch(
      loginUserThunk({
        email: userData.email,
        password: userData.password,
      })
    );

    if (loginResponse.payload?.success) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🪵</span>
            <h1 className="text-2xl font-bold text-amber-800">Artisan Craft</h1>
          </div>
          <p className="text-amber-700">
            Handcrafted wooden treasures await you
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-amber-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center text-amber-700">
              {isLogin
                ? "Sign in to your account to continue shopping"
                : "Join our community of wooden craft enthusiasts"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-amber-900">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        name="firstName"
                        onChange={handleInputChange}
                        className="pl-10 border-amber-200 focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-amber-900">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        name="lastName"
                        onChange={handleInputChange}
                        className="pl-10 border-amber-200 focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-900">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="pl-10 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-amber-900">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="phone"
                      type="tel"
                      name="phoneNumber"
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 border-amber-200 focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-900">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-amber-200 focus:border-amber-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-amber-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-amber-600" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-amber-900">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      name="confirmPassword"
                      onChange={handleInputChange}
                      className="pl-10 pr-10 border-amber-200 focus:border-amber-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-amber-600" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm text-amber-800 leading-5"
                    >
                      I agree to the{" "}
                      <span className="text-amber-600 hover:underline font-medium">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-amber-600 hover:underline font-medium">
                        Privacy Policy
                      </span>
                    </Label>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2.5"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-amber-200" />
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-amber-700">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-amber-700">
          <p>&copy; 2024 WoodCraft Artisans. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

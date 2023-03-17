import "./App.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import WebFont from "webfontloader";
import store from "./redux/store";
import { loadUser } from "./redux/actions/userAction";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import LoginSignUp from "./components/User/LoginSignUp";
import UserOptions from "./components/layout/Header/UserOptions";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import NotFound from "./components/layout/Not Found/NotFound";

function App() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [stripeApiKey, setStripeApiKey] = useState("");

    async function getStripeApiKey() {
        const { data } = await axios.get("/api/v1/stripeapikey");

        setStripeApiKey(data.stripeApiKey);
    }

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Roboto", "Droid Sans", "Chilanka"],
            },
        });

        store.dispatch(loadUser());

        getStripeApiKey();
    }, []);

    console.log("stripeApiKey:", stripeApiKey)
    console.log("window.location.pathname:", window.location.pathname)

    // Thêm để xử lí Route cuối đối với /processs/payment
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return (
        <Router>
            <Header />

            {isAuthenticated && <UserOptions user={user} />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:keyword" element={<Products />} />

                <Route path="/search" element={<Search />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/about" element={<About />} />

                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/me/update"
                    element={
                        <ProtectedRoute>
                            <UpdateProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/password/update"
                    element={
                        <ProtectedRoute>
                            <UpdatePassword />
                        </ProtectedRoute>
                    }
                />
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route path="/password/reset/:token" element={<ResetPassword />} />
                <Route path="/login" element={<LoginSignUp />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                    path="/shipping"
                    element={
                        <ProtectedRoute>
                            <Shipping />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order/confirm"
                    element={
                        <ProtectedRoute>
                            <ConfirmOrder />
                        </ProtectedRoute>
                    }
                />
                {stripeApiKey && (
                    <Route
                        path="/process/payment"
                        element={
                            <ProtectedRoute>
                                <Elements stripe={loadStripe(stripeApiKey)}>
                                    <Payment />
                                </Elements>
                            </ProtectedRoute>
                        }
                    />
                )}
                <Route
                    path="/success"
                    element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <ProductList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/product"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <NewProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/product/:id"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <UpdateProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <OrderList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/order/:id"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <ProcessOrder />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <UsersList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/user/:id"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <UpdateUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reviews"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <ProductReviews />
                        </ProtectedRoute>
                    }
                />

                {/* <Route
                    path="*"
                    element={<NotFound />}
                /> */}


                <Route
                    element={window.location.pathname === "/process/payment" ? null : <NotFound />}
                />
            </Routes>

            <Footer />
        </Router>
    );
}

export default App;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { settingCart } from "../../../../Redux/cartSlice/cartSlice";
import api from "../../../../utils/axios";
const Payment = () => {
  const { cart } = useSelector((state) => state.cartSlice);
  const { filteredUsers } = useSelector((state) => state.usersSlice);

  const id = localStorage.getItem("id");
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = filteredUsers?.data?.find((user) => user._id === id);

  const Subtotal = cart.reduce((total, product) => {
    return total + parseFloat(product.price) * product.quantity;
  }, 0);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    cardnumber: yup
      .string()
      .required("This field is required")
      .matches(/^\d{16}$/, "Must be exactly 16 digits"),
    expDate: yup
      .string()
      .required("This field is required")
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date"),
    cvv: yup
      .string()
      .required("This field is required")
      .matches(/^\d{3}$/, "Must be exactly 3 digits"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      const preOrder = await api.get(`/user/${id}/orders`);
      // console.log(preOrder.data.data.address)
      const prevOrder = preOrder.data.data;
      const address = preOrder.data.data.address;
      const pincode = preOrder.data.data.pincode;

      const orderDetails = {
        Orders: cart,
        CustomerName: values.name,
        Total: Subtotal,
        DeliveryAddress: address,
        DeliveryPincode: pincode,
      };

      const updatedOrder = [...prevOrder, orderDetails];

      if (address.length > 0 && pincode.length > 0) {
        api.post(`/user/${id}/payment-gateway`).then(res=>{
          console.log(res.data)
        }).catch(error=>console.error(error))
        //   await axios
        //     .patch(`http://localhost:8000/User/${id}`, { orders: updatedOrder })
        //     .then((res) => {
        //       setOrders(res.data.orders);
        //     })
        //     .catch((err) => {
        //       console.error("Error updating orders:", err);
        //       toast.error("Something went wrong while updating orders.");
        //     });

        dispatch(settingCart([]));
        // await axios
        //   .patch(`http://localhost:8000/User/${id}`, { cart: [] })
        //   .then((res) => {
        //     dispatch(settingCart(res.data.cart));
        //   })
        //   .catch((err) => {
        //     console.error("Error clearing cart:", err);
        //     toast.error("Something went wrong while clearing the cart.");
        //   });

        resetForm();
        toast.success(`You Paid ₹${Subtotal} Successfully`);
        navigate("/products");
      } else {
        toast.warning("Please Update Your Address");
      }
    } catch (error) {
      console.error("Fetch Failed:", error);
      toast.error("Fetch Failed. Please try again.");
      resetForm();
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  var options = {
    key: "rzp_test_wL1B6IUAUSnQqu", // Enter the Key ID generated from the Dashboard
    amount: Subtotal.toFixed(2),
    currency: "INR",
    name: "Kazpix", //your business name
    description: "Test Transaction",
    image: "../../../Assets/Logo.png",
    order_id:"order_OuxQ5kiOz3P2PD" , //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      console.log(response.razorpay_order_id);
      console.log(response.razorpay_payment_id);
      console.log(response.razorpay_signature);
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature)
    },
    prefill: {
       name: user.username,  
      email: user.email,
      contact: user.contact,
    },
    notes: {
      address: user.address,
      pincode: user.pincode,
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new window.Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
  document.getElementById("rzp-button1").onclick = function (e) {
    rzp1.open();
    e.preventDefault();
  };
  return (
    <div className="max-w-lg mx-auto p-6 my-24 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
      <div className="overflow-hidden">
        <div className="mb-8">
          <div className="flex items-start justify-between text-lg font-medium text-gray-900">
            Shopping cart
          </div>
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cart.map((product) => (
                <li key={product._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={product.href}>{product.title}</a>
                        </h3>
                        <span className="ml-4">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.color}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.price} x {product.quantity}
                      </p>
                    </div>
                    <div className="flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {product.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t mt-4 border-b border-gray-200 py-6 pb-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p className="font-bold text-red-600">₹{Subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="my-5 border-2 rounded-lg p-3">
          <h2 className="font-bold mb-3 text-center">Delivery Address</h2>
          <form>
            {user && (
              <div className="mb-6 text-base">
                <div className="space-y-2">
                  <label
                    htmlFor="Option1"
                    className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 has-[:checked]:bg-blue-50"
                  >
                    <div className="flex items-center">
                      &#8203;
                      <input
                        defaultChecked={true}
                        type="radio"
                        className="size-4 rounded  border-gray-300"
                        id="Option1"
                        name="address"
                      />
                    </div>

                    <div>
                      <p className="mt-1 text-pretty text-sm text-gray-700">
                        Name: {user.username}
                      </p>
                      <p className="mt-1 text-pretty text-sm text-gray-700">
                        Address: {user.address}
                      </p>
                      <p className="mt-1 text-pretty text-sm text-gray-700">
                        Pincode: {user.pincode}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>

        <Formik
          initialValues={{ name: "", cardnumber: "", expDate: "", cvv: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <span className="block text-gray-700">Card Holder Name</span>
                <Field
                  name="name"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Name as in Card"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Card Number</label>
                <Field
                  name="cardnumber"
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="1234 5678 9012 3456"
                />
                <ErrorMessage
                  name="cardnumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">Expiry Date</label>
                  <Field
                    name="expDate"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="MM / YY"
                  />
                  <ErrorMessage
                    name="expDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">CVV</label>
                  <Field
                    name="cvv"
                    type="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="123"
                  />
                  <ErrorMessage
                    name="cvv"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <button
                id="rzp-button1"
                disabled={isSubmitting}
                onClick={() => {
                  setOrders(cart);
                  handleSubmit;
                }}
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Pay Now
              </button>
              <Link to={"/products"} className="block mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Back
                </button>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Payment;

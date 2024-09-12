import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
import api from "../../../../utils/axios";

export default function AdminOrderList() {
  const { id } = useParams();
  const idNum = id.slice(1);
  const userId = localStorage.getItem("id");
  const [open, setOpen] = useState(true);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    api
      .get(`/user/${idNum}/orders`)
      .then((res) => {
        // console.log(res.data.data.products)
        // console.log(res.data.data);
        setUserOrders([res.data.data]);
      })
      .catch((error) => console.error(error.message));
  }, [idNum]);

  // console.log(userOrders);
  return (
    <>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={() => setOpen(true)}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center my-8 sm:my-0 md:px-2 lg:px-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <DialogPanel className="items-center text-center flex w-full transform text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <Link to="/admin/userslist">
                        <XMarkIcon
                          className="h-6 w-6 end-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </button>
                    <div className="overflow-x-auto">
                      {userOrders.length > 0 ? (
                        <div className="p-2 text-start">
                          <h1 className="text-xl font-semibold mb-4">
                            Order Details
                          </h1>
                          {userOrders.map((order) => (
                            <div
                              key={order._id}
                              className="mb-8 p-2 bg-white shadow-lg rounded-lg border-l-4 border-indigo-600"
                            >
                              {/* {console.log(order)} */}
                              <div className="mb-1">
                                <p>Customer Name: {order.Customer_Name}</p>
                                <p>Billing Address: {order.address}</p>
                                <p>Billing Pincode: {order.pincode}</p>
                              </div>
                              <h2 className="text-base mb-2 text-rose-600">
                                Items
                              </h2>
                              <ul className="space-y-4">
                                <li className="items-center space-x-4 p-2 border rounded-lg">
                                  <div>
                                    {order.products.map((product) => (
                                      <Fragment key={product._id}>
                                        <p className="font-bold text-lg text-indigo-900">
                                          {product.productId.title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {product.productId.category}
                                        </p>
                                        <p className="font-semibold">
                                          Price:{" "}
                                          {product.productId.price}
                                        </p>
                                        <p className="font-semibold">
                                          Quantity: {product.quantity}
                                        </p>
                                      </Fragment>
                                    ))}
                                  </div>
                                </li>
                              </ul>
                              <p className="font-semibold my-5 ms-5">
                                Paid Amount: {order.Total_Amount}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center font-bold">
                          No Orders founded
                        </p>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

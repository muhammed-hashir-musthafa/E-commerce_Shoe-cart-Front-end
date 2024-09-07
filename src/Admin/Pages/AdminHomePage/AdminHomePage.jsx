import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../User/Componet/Contexts/Contexts";
import { Link } from "react-router-dom";
// import axios from "axios";
import { useSelector } from "react-redux";
import api from "../../../../utils/axios";

export default function AdminHomePage() {
    // const {users} =useContext(CartContext)
    const [totalOrder,setTotalOrder]=useState([])
    const {products} = useSelector((state) => state.productSlice);
    const { users } = useSelector((state) => state.usersSlice);
  
    // console.log(products.data)
    useEffect(()=>{
        api.get("/admin/orders")
        .then(res=>{
          // console.log(res.data.data.length)
            setTotalOrder(res.data.data.length)
        })
    },[])

    // const subTotalOrders =totalOrder.reduce((total,user)=>{
    //     return total+=user.orders.length
    // },0)

  return (
    <>
      <div className="md:ms-44 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold"> {users?.data?.length} </div>
              </div>
              <div className="text-sm font-medium text-gray-400">Users</div>
            </div>
          </div>

         <Link
            to="/admin/usersList"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </Link>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold"> {products?.data?.length}</div>
              </div>
              <div className="text-sm font-medium text-gray-400">Products</div>
            </div>
          </div>
          <Link
            to="/admin/productPage"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </Link>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1">{totalOrder} </div>
              <div className="text-sm font-medium text-gray-400">Orders</div>
            </div>
          </div>
          <Link
            to="/admin/usersList"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </Link>
        </div>
      </div>
    </>
  );
}

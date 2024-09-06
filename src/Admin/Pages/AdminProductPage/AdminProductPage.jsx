import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
// import { CartContext } from "../../../User/Componet/Contexts/Contexts";
import SearchBar from "../../../G-Components/SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  categorize,
  deleteProduct,
} from "../../../../Redux/productSlice/productSlice";
import api from "../../../../utils/axios";

export const AdminProductPage = () => {
  const dispatch = useDispatch();
  const { filteredProducts } = useSelector((state) => state.productSlice);
  const { category } = useSelector((state) => state.productSlice);

  // const { filterItems, setFilterItems, setCategory, categorize, category } =
  // useContext(CartContext);

  const handleCategory = (e) => {
    const newCategory = e.target.value;
    dispatch(categorize(newCategory));
  };

  const handleProductRemove = (product) => {
    api.delete(`/admin/${product.id}/product`).then(() => {
      dispatch(deleteProduct(product));
      toast.success(`Product '${product.title}' Removed`);
    });
  };
  const navigate = useNavigate();

  // console.log(filterItems);
  return (
    <>
      <div className="sm:ms-52 ">
        <div className="bg-white ">
          <div className="lg:pb-0 pb-5 text-center sm:text-start flex justify-between ">
            <Link
              to={"/admin/addproduct"}
              type="button"
              className="rounded-md bg-indigo-600 w-1/2 sm:w-fit sm:ms-12 text-center   py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add New Product
            </Link>
            <select
              className="text-sm font-semibold leading-6 text-gray-900 text-center me-10"
              onChange={handleCategory}
            >
              <option
                className="text-sm font-semibold leading-6 text-gray-900 text-center"
                value="all"
              >
                Categories
              </option>
              <option
                className="text-sm font-semibold leading-6 text-gray-900 text-center"
                value="all"
              >
                All
              </option>
              <option
                className="text-sm font-semibold leading-6 text-gray-900 text-center"
                value="men"
              >
                Men
              </option>
              <option
                className="text-sm font-semibold leading-6 text-gray-900 text-center"
                value="women"
              >
                Women
              </option>
            </select>
          </div>
          <SearchBar />
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Special for you
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {filteredProducts.data?.map((product) => (
                <div key={product._id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 sm:h-80 border">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-2 ">
                    <div>
                      <h3 className="text-sm text-gray-700 flex justify-between">
                        {product.title}
                        <span className="text-md font-medium text-gray-900">
                          ₹{product.price}
                        </span>
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.color}{" "}
                      </p>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          navigate(`/admin/products/:${product.id}`);
                        }}
                        type="button"
                        className="rounded-md bg-indigo-600 w-1/2  py-2  mt-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleProductRemove(product)}
                        type="button"
                        className="rounded-md bg-red-600 w-1/2 py-2 mt-2  text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

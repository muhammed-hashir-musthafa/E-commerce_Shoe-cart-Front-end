import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import wishlist from "../../../Assets/wishlist icon.png";
// import { toast } from "react-toastify";
import { CartContext } from "../../Componet/Contexts/Contexts";
import SearchBar from "../../../G-Components/SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../../../Redux/cartSlice/cartSlice";
import toast  from "react-hot-toast";
import {
  settingWishList,
  removeFromWishListAsync,
  addToWishListAsync,
} from "../../../../Redux/wishlistSlice/wishlistSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { filteredProducts } = useSelector((state) => state.productSlice);
  const { wishlist, status: wishlistStatus } = useSelector(
    (state) => state.wishlistSlice
  );

  // const { addToCart, filterItems } = useContext(CartContext);

  const handleCart = (product) => {
    // dispatch(addCart(product));
    dispatch(addToCartAsync(product));

    // addToCart(product);
    // console.log(cart);
    toast.success("Product added Successfully");
    // toast.success(`product added successfully`);
  };

  useEffect(() => {
    if (wishlistStatus === "idle") {
      dispatch(settingWishList());
    }
  }, [dispatch, wishlistStatus]);

  const handleWishlist = (productId) => {
    const isInWishlist = wishlist.some((item) => item.id === productId);
    if (isInWishlist) {
      dispatch(removeFromWishListAsync(productId));
      toast.success("Product removed from wishlist");
    } else {
      const product = filteredProducts.find((item) => item.id === productId);
      if (product) {
        dispatch(addToWishListAsync(product));
        toast.success("Product added to wishlist");
      }
    }
  };
  // console.log(filteredProducts);
  // console.log(filterItems);
  return (
    <>
      <SearchBar />
      <div>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Special for you
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="group relative">
                  <button
                    onClick={() => handleWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        wishlist.some((item) => item.id === product.id)
                          ? "red"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className={`w-6 h-6 ${
                        wishlist.some((item) => item.id === product.id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.51 6.51 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>
                  <Link
                    to={`/products/:${product.id}`}
                    index={index}
                    product={product}
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 sm:h-80 border">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                  </Link>

                  <div className="mt-2 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{product.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color}
                      </p>
                    </div>
                    <p className="text-md font-medium text-gray-900">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => handleCart(product)}
                      type="button"
                      className="rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add to cart
                    </button>
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

export default ProductPage;

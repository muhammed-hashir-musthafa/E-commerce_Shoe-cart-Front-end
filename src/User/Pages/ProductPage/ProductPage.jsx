import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../../G-Components/SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  settingWishList,
  removeFromWishListAsync,
  addToWishListAsync,
} from "../../../../Redux/wishlistSlice/wishlistSlice";
import { fetchProducts } from "../../../../Redux/productSlice/productSlice";

const ProductPage = () => {
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlistSlice.wishlist);
  const wishlistStatus = useSelector((state) => state.wishlistSlice.status);
  const filteredProducts = useSelector((state) => state.productSlice.filteredProducts);

  useEffect(() => {
    dispatch(fetchProducts());
    if (wishlistStatus === "idle") {
      dispatch(settingWishList());
    }
    
  }, [dispatch, wishlistStatus]);

  const handleWishlist = (productId) => {
    const isInWishlist = wishlist.some((item) => item._id === productId);

    if (isInWishlist) {
      dispatch(removeFromWishListAsync(productId));
      toast.success("Product removed from wishlist");
    } else {
      const product = filteredProducts?.data?.find(
        (item) => item._id === productId
      );
      if (product) {
        dispatch(addToWishListAsync(product));
        toast.success("Product added to wishlist");
      }
    }
  };

  if (!filteredProducts?.data || filteredProducts.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-50"></div>
        <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
      </div>
    );
  }

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
              {filteredProducts?.data?.map((product) => (
                <div key={product._id} className="group relative">
                  <button
                    onClick={() => handleWishlist(product._id)}
                    className="absolute top-3 right-3 z-10 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={wishlist.some((item) => item._id === product._id) ? "red" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className={`w-6 h-6 ${
                        wishlist.some((item) => item._id === product._id) ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.51 6.51 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>
                  <Link to={`/products/${product._id}`}>
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
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    </div>
                    <p className="text-md font-medium text-gray-900">₹{product.price}</p>
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

import React from "react";
import { Route, Redirect } from "@/component/route";

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center items-center p-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Welcome to Our Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Discover our amazing products or explore our API documentation to
          integrate with our services.
        </p>
      </header>

      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Products Card */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Explore Our Products
              </h2>
              <p className="text-gray-600">
                Browse through our curated collection of high-quality products
                tailored to your needs.
              </p>
            </div>
            <Route
              message="View Products →"
              path="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            />
          </div>
        </div>

        {/* API Docs Card */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                API Documentation
              </h2>
              <p className="text-gray-600">
                Integrate with our platform using our comprehensive Swagger API
                documentation.
              </p>
            </div>

            <Redirect
              message="Explore API Docs →"
              path={`${process.env.NEXT_PUBLIC_BASE_URL}/api-docs/`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            />
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Need help? Contact our support team at support@example.com</p>
      </footer>
    </div>
  );
};

export default Page;

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllBlogs } from "@/api/axios/blogs";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs(!!user).then(setBlogs).catch(() => setBlogs([]));
  }, [user]);
 console.log("Blogs:", blogs);
  return (
    <div className="min-h-screen bg-white">
      <Header />
       
      <div className="w-full max-w-5xl mx-auto mt-10  px-4 space-y-6">
        {blogs.length === 0 ? (
          <div className="text-gray-500 text-center">No blogs found.</div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
             className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-gray-100 p-3 sm:p-4 rounded-md flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 shadow relative"
            >
              <img
                src={blog.thumbnail || "https://via.placeholder.com/120"}
                alt="thumbnail"
                className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded mb-2 sm:mb-0"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{blog.title}</h3>
                <p className="text-gray-700 text-sm mt-1">
                  {blog.content}...
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  By {blog.author?.name || "Unknown"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

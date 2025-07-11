import { privateAxios, publicAxios } from "./axiosInstance";

export const createBlog = async (blogData) => {
  try {
    const res = await privateAxios.post("/blogs/create", blogData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create blog" };
  }
};

export const getMyBlogs = async ({ page = 1, search = "" } = {}) => {
  try {
    const res = await privateAxios.get(
      `/blogs/user/me?page=${page}&limit=3&search=${encodeURIComponent(search)}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch blogs" };
  }
};

export const getAllBlogs = async (excludeMe = false) => {
  const url = excludeMe ? "/blogs?excludeMe=true" : "/blogs";
   const axiosInstance = excludeMe ? privateAxios : publicAxios; // or publicAxios if not logged in
const res = await axiosInstance.get(url);
  return res.data;
};
export const getBlogById = async (id) => {
  
  const res = await privateAxios.get(`/blogs/${id}`);
  return res.data;
};

export const updateBlog = async (id, blogData) => {
  console.log(blogData, "blogs data");
  const res = await privateAxios.put(`/blogs/${id}`, blogData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await privateAxios.delete(`/blogs/${id}`);
  return res.data;
};

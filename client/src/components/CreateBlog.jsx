import React, { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import Header from "./Header";
import { createBlog, getBlogById, updateBlog } from "@/api/axios/blogs";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getBlogById(id).then((blog) => {
        setTitle(blog.title);
        setContent(blog.content);
        setThumbnailPreview(blog.thumbnail);
        setThumbnail(null);
      });
    }
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Only PNG, JPG, JPEG files are allowed.",
      }));
      setThumbnail(null);
      setThumbnailPreview(null);
      return;
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
    if (errors.thumbnail)
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};

    const titleWords = wordCount(title);
    if (!title) newErrors.title = "Title is required.";
    else if (titleWords < 5 || titleWords > 8)
      newErrors.title = "Title must be between 5 and 8 words.";

    const contentWords = wordCount(content);
    if (!content) newErrors.content = "Content is required.";
    else if (contentWords > 100)
      newErrors.content = "Content must be at most 100 words.";

    if (!id && !thumbnail) newErrors.thumbnail = "Thumbnail is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      if (id) {
        await updateBlog(id, formData);
      } else {
        await createBlog(formData);
      }
      navigate("/my-blogs");
    } catch (error) {
      setErrors({ general: error.message || "Failed to post blog." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-blogs");
    setTitle("");
    setContent("");
    setThumbnail(null);
    setThumbnailPreview(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <Header />
      <div className="w-full mt-6 px-2 sm:px-8">
        <p className="text-sm text-gray-500">
          <Link to="/" className="text-gray-400 hover:underline">
            Home
          </Link>
          <span className="mx-1">→</span>
          <Link
            to="/my-blogs"
            className="text-gray-800 font-medium hover:underline"
          >
            My Blogs
          </Link>
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 mt-8">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Blog Title"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
        {errors.title && (
          <div className="text-red-500 text-xs mt-1 ml-1">{errors.title}</div>
        )}

        {/* Content */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your blog content..."
          rows="6"
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
        ></textarea>
        {errors.content && (
          <div className="text-red-500 text-xs mt-1 ml-1">{errors.content}</div>
        )}

        {/* Thumbnail */}
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
          <label htmlFor="thumbnail" className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiCamera size={30} />
              <span className="mt-2">Add Thumbnail</span>
            </div>
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleImageUpload}
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
          />
          {thumbnail && (
            <div className="mt-4 text-sm text-green-600">{thumbnail.name}</div>
          )}
          {thumbnailPreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="max-h-40 rounded shadow"
              />
            </div>
          )}
          {errors.thumbnail && (
            <div className="text-red-500 text-xs mt-1">{errors.thumbnail}</div>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="text-red-500 text-xs mt-2 text-center">
            {errors.general}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading
              ? id
                ? "Updating..."
                : "Posting..."
              : id
              ? "Update Blog"
              : "Post Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;

import Header from '@/components/Header'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from '@/api/axios/blogs';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import Paginations from "@/components/Paginations";

const Myblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch blogs with pagination and search
  useEffect(() => {
    getMyBlogs({ page, search }).then(res => {
      setBlogs(res.posts);
      setTotalPages(res.totalPages);
    }).catch(() => setBlogs([]));
  }, [page, search]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    }
    if (menuOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleCreateClick = () => {
    navigate("/create-blogs"); 
  };

  const handleEdit = (blogId) => {
    
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDeleteClick = (blogId) => {
    setBlogToDelete(blogId);
    setDeleteDialogOpen(true);
    setMenuOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-6 py-4 mt-6 gap-3">
        <input
          type="text"
          placeholder="🔍 Search your blogs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button
          onClick={handleCreateClick}
        //   className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto"
        className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-md transition"

        >
          ✏️ Create
        </button>
      </div>
      {/* Blog Cards */}
      <div className="flex flex-col items-center gap-4 px-2 pb-8">
        {blogs.length === 0 && (
          <div className="text-gray-500 mt-10">No blogs found.</div>
        )}
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-gray-100 p-3 sm:p-4 rounded-md flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 shadow relative"
          >
            <img
              src={blog.thumbnail || "https://via.placeholder.com/150"}
              alt="blog"
              className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded mb-2 sm:mb-0"
            />
            <div className="flex-1 w-full">
              <h2 className="mt-2 font-semibold text-gray-900 text-base sm:text-lg leading-snug">{blog.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{blog.content}...</p>
              <p className="text-xs text-gray-500 mt-2">By {blog.author?.username || "You"}</p>
            </div>
            <div className="relative self-end sm:self-auto" ref={menuRef}>
              <button
                className="text-xl text-gray-500 hover:text-black"
                onClick={() => setMenuOpen(menuOpen === blog._id ? null : blog._id)}
              >
                ⋮
              </button>
              {menuOpen === blog._id && (
                <div className="absolute right-0 top-8 bg-white border rounded shadow-lg z-10 w-28">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onMouseDown={() => handleEdit(blog._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    onMouseDown={() => handleDeleteClick(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination below the blog list */}
      <div className="flex justify-center mt-6">
        <Paginations
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
      </div>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Myblog
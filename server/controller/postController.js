import Post from "../models/Post.js";
import cloudinary from "../service/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

 
export const createPost = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_thumbnails", timeout: 1200000 }, // 2 minutes
          (error, result) => {
            if (error) return reject(error);
            imageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }
    const post = await Post.create({
      ...req.body,
      author: req.user.id,
      thumbnail: imageUrl,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload image" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    let filter = {};
  
    if (req.query.excludeMe === "true" && req.user) {
      filter.author = { $ne: req.user.id };
    }
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 });
      console.log(posts,"postess")
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

export const updatePost = async (req, res) => {
 
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

 
    let imageUrl = post.thumbnail;
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_thumbnails", timeout: 1200000 },
          (error, result) => {
            if (error) return reject(error);
            imageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // Update fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.thumbnail = imageUrl;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update blog" });
  }
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

export const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search || "";

    const query = {
      author: req.user.id,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      })
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

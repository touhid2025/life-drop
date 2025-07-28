import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://assignment-twelve-server-side-eight.vercel.app/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10 text-red-500">Blog not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-red-600 hover:underline mb-4"
      >
        <FaArrowLeft /> Back to Blogs
      </Link>

      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-xl shadow"
      />
      <h1 className="text-3xl font-bold mt-6 mb-4">{blog.title}</h1>

      {blog.createdAt && (
        <p className="text-sm text-gray-500 mb-2">
          Published on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      )}

      <div
        className="prose max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogDetails;

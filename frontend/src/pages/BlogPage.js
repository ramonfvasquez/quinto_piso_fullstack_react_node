import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/pages/BlogPage.css';
import ReadMoreButton from '../components/layout/ReadMoreButton';

function BlogPage() {
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      const response = await axios.get('http://localhost:3000/api/blog');
      setPosts(response.data);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const mapPosts = () => {
    if (posts.length > 0) {
      return posts.map((post, postIndex) => {
        if (postIndex < 5) {
          return (
            <div key={postIndex} className="post">
              <p className="post-date">{post.BlogPostPublicationDate}</p>
              <h1 className="post-title">{post.BlogPostTitle}</h1>
              <p className="post-author">
                por {post.BlogPostAuthor.userFullName}
              </p>
              <p className="post-body">{post.BlogPostBody}</p>
              <ReadMoreButton
                text="Leer más"
                author={post.BlogPostAuthor.userFullName}
                date={post.BlogPostPublicationDate}
                postTitle={post.BlogPostTitle}
                content={post.BlogPostBody}
              />
            </div>
          );
        }
      });
    } else {
      return <h1>Estamos trabajando para mejorar el sitio.</h1>;
    }
  };

  const oldPosts = () => {
    return (
      <Link to="/blog/posts">
        <p onClick={handleLinkClick}>Ver publicaciones anteriores</p>
      </Link>
    );
  };

  return (
    <div className="blogpage-container">
      <div className="section-header blogpage-header">
        <h1>Blog</h1>
      </div>
      <div className="blogpage-img-container">
        <img
          src={require('../images/pages/blog.jpg').default}
          alt=""
          className="blogpage-img"
        />
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="section-body blogpage-body">
          {mapPosts()}
          {posts.length > 5 ? oldPosts() : ''}
        </div>
      )}
    </div>
  );
}

export default BlogPage;

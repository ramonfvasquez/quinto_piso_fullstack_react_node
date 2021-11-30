import axios from 'axios';
import { useState, useEffect } from 'react';
import '../styles/components/pages/PostsPage.css';
import ReadMoreButton from '../components/layout/ReadMoreButton';

const PostsPage = () => {
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
        if (postIndex > 4) {
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
    }
  };

  return (
    <div className="postspage-container">
      <div className="section-header postspage-header">
        <h1>Blog</h1>
        <p>Publicaciones anteriores</p>
      </div>
      <div className="section-body blogpage-body">{mapPosts()}</div>
    </div>
  );
};

export default PostsPage;

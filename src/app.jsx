import { useEffect, useState } from 'react';
import { fetchPosts } from './api/fetchPosts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPosts({ page: 1, size: 10, sort: '-published_at' })
      .then((res) => {
        setPosts(res.data); // ambil data array dari API
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Ideas</h1>
      <div className="row g-3">
        {posts.map((post) => (
          <div className="col-md-4" key={post.id}>
            <div className="card h-100">
              <img
                src={post.small_image?.[0]?.url}
                alt={post.title}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

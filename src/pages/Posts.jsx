import { useEffect, useState } from 'react';
import { fetchPosts } from '../api/ideas';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(() => Number(localStorage.getItem('page')) || 1);
  const [size, setSize] = useState(() => Number(localStorage.getItem('size')) || 10);
  const [sort, setSort] = useState(() => localStorage.getItem('sort') || '-published_at');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('page', page);
    localStorage.setItem('size', size);
    localStorage.setItem('sort', sort);

    setLoading(true);
    fetchPosts({ page, size, sort })
      .then((data) => {
        setPosts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, size, sort]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Ideas</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Sort:
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="-published_at">Terbaru</option>
            <option value="published_at">Terlama</option>
          </select>
        </label>

        <label>
          Show per page:
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ marginLeft: '0.5rem' }}>
            {[10, 20, 50].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <img
              src={post.small_image?.[0]?.url}
              alt={post.title}
              style={{
                width: '100%',
                aspectRatio: '16/9',
                objectFit: 'cover'
              }}
              loading="lazy"
            />
            <div style={{ padding: '0.75rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  minHeight: '3.6em'
                }}
              >
                {post.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0 0' }}>
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            marginRight: '0.5rem',
            padding: '0.5rem 1rem',
            cursor: page === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Prev
        </button>
        <span style={{ margin: '0 0.5rem' }}> Page {page} </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          style={{
            marginLeft: '0.5rem',
            padding: '0.5rem 1rem'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

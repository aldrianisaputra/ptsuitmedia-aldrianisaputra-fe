export const fetchPosts = async ({ page = 1, size = 10, sort = '-published_at' }) => {
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: {
          number: page,
          size,
        },
        append: ['small_image', 'medium_image'],
        sort,
      }),
    });
  
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  };
  
export const fetchPosts = async ({ page = 1, size = 10, sort = '-published_at' }) => {
    const url = new URL('/api/ideas', window.location.origin);
    url.searchParams.set('page[number]', page);
    url.searchParams.set('page[size]', size);
    url.searchParams.append('append[]', 'small_image');
    url.searchParams.append('append[]', 'medium_image');
    url.searchParams.set('sort', sort);
  
    const response = await fetch(url.toString());
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
    }
  
    return response.json();
  };
  
const API_BASE = 'https://suitmedia-backend.suitdev.com/api/ideas';

// State
let page = 1;
let pageSize = parseInt(localStorage.getItem('pageSize')) || 10;
let sortOrder = localStorage.getItem('sortOrder') || '-published_at';

// Element selectors
const postsContainer = document.getElementById('posts-container');
const paginationContainer = document.getElementById('pagination');
const pageSizeSelect = document.getElementById('page-size');
const sortOrderSelect = document.getElementById('sort-order');

// Set default select values
pageSizeSelect.value = pageSize;
sortOrderSelect.value = sortOrder;

// Event listeners
pageSizeSelect.addEventListener('change', () => {
  pageSize = parseInt(pageSizeSelect.value);
  page = 1;
  localStorage.setItem('pageSize', pageSize);
  fetchPosts();
});

sortOrderSelect.addEventListener('change', () => {
  sortOrder = sortOrderSelect.value;
  page = 1;
  localStorage.setItem('sortOrder', sortOrder);
  fetchPosts();
});

// Fetch posts
async function fetchPosts() {
  try {
    const res = await fetch(
      `${API_BASE}?page[number]=${page}&page[size]=${pageSize}&append[]=medium_image&append[]=small_image&sort=${sortOrder}`, {
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded: ${text}`);
    }

    const data = await res.json();
    postsContainer.innerHTML = '';

    data.data.forEach(post => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      const imgSrc = `/img1.png`; // fallback ke gambar lokal

      col.innerHTML = `
        <div class="card h-100">
          <img src="${imgSrc}" class="card-img-top" alt="${post.title}" loading="lazy" style="aspect-ratio:16/9;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title text-truncate-3">${post.title}</h5>
            <p class="card-text text-muted">${new Date(post.published_at).toLocaleDateString()}</p>
          </div>
        </div>
      `;

      postsContainer.appendChild(col);
    });

    renderPagination(data.meta.last_page);

  } catch (err) {
    console.error('❌ ERROR:', err.message);
    postsContainer.innerHTML = `<p style="color:red">Gagal memuat data</p>`;
  }
}

// Render pagination
function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';

  // <<
  const prev = document.createElement('li');
  prev.className = `page-item ${page === 1 ? 'disabled' : ''}`;
  prev.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
  prev.onclick = e => {
    e.preventDefault();
    if (page > 1) {
      page--;
      fetchPosts();
    }
  };
  paginationContainer.appendChild(prev);

  // Page numbers (maksimal 5 ditampilkan)
  const maxPagesToShow = 5;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === page ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.onclick = e => {
      e.preventDefault();
      page = i;
      fetchPosts();
    };
    paginationContainer.appendChild(li);
  }

  // >>
  const next = document.createElement('li');
  next.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
  next.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
  next.onclick = e => {
    e.preventDefault();
    if (page < totalPages) {
      page++;
      fetchPosts();
    }
  };
  paginationContainer.appendChild(next);
}

// Initial load
fetchPosts();

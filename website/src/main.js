import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const searchInput = document.getElementById('tool-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.tool-card');
  const toolsGrid = document.getElementById('tools-grid');
  const emptyState = document.getElementById('search-empty-state');
  const searchQueryHighlight = document.getElementById('search-query-highlight');
  const resetSearchBtn = document.getElementById('reset-search-btn');

  let activeFilter = 'all';
  let searchQuery = '';

  // --- Card Mouse Shine Effect ---
  // Calculates cursor coordinates inside each card to update CSS variables for a premium shine overlay.
  toolCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });

  // --- Filtering Logic ---
  const filterTools = () => {
    let visibleCount = 0;
    const query = searchQuery.toLowerCase().trim();

    toolCards.forEach(card => {
      const name = card.querySelector('.tool-name').textContent.toLowerCase();
      const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
      const tags = card.getAttribute('data-tags').toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = !query || name.includes(query) || desc.includes(query) || tags.includes(query);
      const matchesCategory = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        // Retrigger scroll reveal check in case item became visible
        card.classList.add('revealed');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update Grid and Empty State Display
    if (visibleCount === 0) {
      toolsGrid.style.display = 'none';
      emptyState.style.display = 'block';
      searchQueryHighlight.textContent = searchQuery;
    } else {
      toolsGrid.style.display = 'grid';
      emptyState.style.display = 'none';
    }
  };

  // --- Search Input Listeners ---
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    
    // Toggle clear search button visibility
    if (searchQuery.length > 0) {
      clearSearchBtn.style.display = 'flex';
    } else {
      clearSearchBtn.style.display = 'none';
    }
    
    filterTools();
  });

  // Clear Search Action
  const clearSearch = () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    filterTools();
    searchInput.focus();
  };

  clearSearchBtn.addEventListener('click', clearSearch);
  resetSearchBtn.addEventListener('click', clearSearch);

  // --- Category Button Listeners ---
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      activeFilter = button.getAttribute('data-filter');
      filterTools();
    });
  });

  // --- Scroll Reveal Animation ---
  // Uses Intersection Observer to transition opacity and translate offsets on scrolling.
  const revealItems = document.querySelectorAll('.reveal-item');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Trigger slightly after item edge enters viewport
      rootMargin: '0px 0px -50px 0px' // Offset trigger for a better timing feel
    });

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback for older browsers: show items instantly
    revealItems.forEach(item => item.classList.add('revealed'));
  }
});

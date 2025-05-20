document.addEventListener('DOMContentLoaded', function() {
    const animeContainer = document.getElementById('anime-container');
    const statusFilter = document.getElementById('status-filter');
    fetchAnime();
    statusFilter.addEventListener('change', function() {
        fetchAnime(this.value);
    });

    async function fetchAnime(status = 'all') {
        let url = 'https://kitsu.io/api/edge/anime?page[limit]=20';
        
        if (status !== 'all') {
            url += `&filter[status]=${status}`;
        }
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayAnime(data.data);
        } catch (error) {
            console.error('Error fetching anime:', error);
            animeContainer.innerHTML = '<p>Error loading anime. Please try again later.</p>';
        }
    }

    function displayAnime(animeList) {
        animeContainer.innerHTML = '';

        if (!animeList || animeList.length === 0) {
            animeContainer.innerHTML = '<p>No anime found for this filter.</p>';
            return;
        }
        animeList.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            animeContainer.appendChild(animeCard);
        });
    }

    function createAnimeCard(anime) {
        const attributes = anime.attributes;
        const posterImage = attributes.posterImage?.medium;
        const status = attributes.status;
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
            <img src="${posterImage}" alt="${attributes.canonicalTitle}" class="anime-poster">
            <div class="anime-info">
                <div class="anime-title">${attributes.canonicalTitle}</div>
                <span class="anime-status status-${status}">${formatStatus(status)}</span>
            </div>
        `;
        return animeCard;
    }

    function formatStatus(status) {
        const statusMap = {
            'current': 'On Going',
            'finished': 'Finished',
            'upcoming': 'Upcoming',
            'unknown': 'Unknown'
        };
        return statusMap[status] || status;
    }
});
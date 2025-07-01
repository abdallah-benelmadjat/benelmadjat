document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gallery Modal
    const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const galleryImages = document.querySelectorAll(".gallery-item img");
    const closeBtn = document.querySelector(".close-button");

    if (modal && closeBtn) {
        galleryImages.forEach(img => {
            img.onclick = function(){
                modal.style.display = "block";
                modalImg.src = this.src;
                captionText.innerHTML = this.nextElementSibling.innerHTML;
            }
        });

        const closeModal = function() {
            modal.style.display = "none";
        }

        closeBtn.onclick = closeModal;

        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    }

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.innerHTML = '&#8679;';
    document.body.appendChild(scrollToTopBtn);

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    scrollToTopBtn.addEventListener('click', function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // Hamburger menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    function loadAndDisplayData() {
        fetch('benelmadjat_data.json', { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const totalCount = data.length;
                const outsideAlgeriaCount = data.filter(person => !person.location.includes('Algeria')).length;

                const totalCountEl = document.getElementById('total-count');
                const outsideAlgeriaEl = document.getElementById('outside-algeria');
                const variantPercentageEl = document.getElementById('variant-percentage');

                if (totalCountEl) totalCountEl.textContent = totalCount;
                if (outsideAlgeriaEl) outsideAlgeriaEl.textContent = `${((outsideAlgeriaCount / totalCount) * 100).toFixed(2)}%`;

                const variantPercentage = 100; // Assuming all entries are "Benelmadjat" variants for now
                if (variantPercentageEl) variantPercentageEl.textContent = `${variantPercentage}%`;

                const personCardsContainer = document.getElementById('person-cards-container');
                if (personCardsContainer) {
                    personCardsContainer.innerHTML = ''; // Clear existing cards
                    data.forEach(person => {
                        const personCard = document.createElement('div');
                        personCard.className = 'person-card';

                        const img = document.createElement('img');
                        img.src = person.image || 'images/default-avatar.png'; // Use a default image if none is provided
                        img.alt = person.name;

                        const personInfo = document.createElement('div');
                        personInfo.className = 'person-info';

                        const name = document.createElement('h3');
                        name.textContent = person.name;

                        const location = document.createElement('p');
                        location.innerHTML = `<strong>Location:</strong> ${person.location}`;

                        personInfo.appendChild(name);
                        personInfo.appendChild(location);

                        if (person.contact) {
                            const contactElement = document.createElement('p');
                            contactElement.innerHTML = `<strong>LinkedIn:</strong> <a href="${person.contact}" target="_blank">Profile</a>`;
                            personInfo.appendChild(contactElement);
                        }

                        if (person.contact2) {
                            const contact2Element = document.createElement('p');
                            contact2Element.innerHTML = `<strong>Facebook:</strong> <a href="${person.contact2}" target="_blank">Profile</a>`;
                            personInfo.appendChild(contact2Element);
                        }

                        personCard.appendChild(img);
                        personCard.appendChild(personInfo);

                        personCardsContainer.appendChild(personCard);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching or parsing benelmadjat_data.json:', error);
                alert('Failed to load data. Please check the console for details. Error: ' + error);
            });
    }

    // Initial load
    loadAndDisplayData();
});

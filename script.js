let currentPage = 'home';
let currentCategory = 'all';
let currentWork = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWorksFilter();
    renderWorks();
    initScrollAnimations();
    initImageZoom();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const logo = document.querySelector('.logo');

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.dataset.page;
            if (page) {
                e.preventDefault();
                navigateTo(page);
            }
        });
    });

    const dropdownLinks = document.querySelectorAll('.dropdown-menu a[data-category]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            currentCategory = category;
            
            document.querySelectorAll('.nav-links a[data-page]').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.dataset.page === 'works') {
                    navLink.classList.add('active');
                }
            });

            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

            const worksPage = document.getElementById('works-page');
            if (worksPage) {
                setTimeout(() => {
                    worksPage.classList.add('active');
                    renderWorks();
                    initScrollAnimations();
                    updateFilterButtons();
                }, 50);
            }

            currentPage = 'works';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function navigateTo(page) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
            if (page === 'home' || page === 'works') {
                currentCategory = 'all';
                renderWorks();
                initScrollAnimations();
                updateFilterButtons();
            }
        }, 100);
    }

    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initWorksFilter() {
    const filterContainer = document.getElementById('works-filter');
    if (!filterContainer) return;

    const categories = [
        { id: 'all', name: '全部' },
        { id: 'poster', name: '海报' },
        { id: 'activity-page', name: '活动页' },
        { id: 'daily-home', name: '日常首页' },
        { id: 'daily-detail', name: '主图及详情' },
        { id: 'activity-main', name: '活动主图' },
        { id: 'other', name: '其他' }
    ];

    filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn neu-btn ${cat.id === currentCategory ? 'active' : ''}" 
                data-category="${cat.id}">
            ${cat.name}
        </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            updateFilterButtons();
            renderWorks();
        });
    });
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
}

function renderWorks() {
    const grids = [
        document.getElementById('works-grid'),
        document.getElementById('works-grid-page')
    ];

    let filteredWorks = worksData;
    if (currentCategory !== 'all') {
        filteredWorks = worksData.filter(work => work.category === currentCategory);
    }

    // 随机排序
    filteredWorks = [...filteredWorks].sort(() => Math.random() - 0.5);

    grids.forEach(grid => {
        if (!grid) return;
        grid.innerHTML = '';
        
        // 创建列元素
        const columnCount = window.innerWidth <= 768 ? 2 : 5;
        const columns = [];
        const columnHeights = [];
        
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'works-column';
            column.style.flex = '1';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.gap = '20px';
            grid.appendChild(column);
            columns.push(column);
            columnHeights.push(0);
        }
        
        // 渲染卡片
        filteredWorks.forEach((work, index) => {
            const card = document.createElement('div');
            card.className = 'work-card visible';
            card.dataset.id = work.id;
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="work-info">
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-category">${getCategoryName(work.category)}</p>
                </div>
                <img src="${work.image}" alt="${work.title}" class="work-image">
            `;
            
            // 找到最短的列
            const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            columns[shortestColumnIndex].appendChild(card);
            
            // 预估卡片高度（用于瀑布流）
            // 由于实际高度需要图片加载后才能确定，这里用简单的方式
            columnHeights[shortestColumnIndex] += 300; // 预估高度
            
            card.addEventListener('click', () => {
                const workId = parseInt(card.dataset.id);
                showWorkDetail(workId);
            });
        });
    });
}

function getCategoryName(category) {
    const names = {
        'poster': '海报',
        'activity-page': '活动页',
        'activity-main': '活动主图',
        'daily-home': '日常首页',
        'daily-detail': '主图及详情',
        'other': '其他'
    };
    return names[category] || category;
}

let currentImageIndex = 0;
let isDragging = false;

function showWorkDetail(workId) {
    currentWork = worksData.find(w => w.id === workId);
    if (!currentWork) return;

    currentImageIndex = 0;
    
    const images = currentWork.images || [currentWork.image];
    document.getElementById('detail-image').src = images[0];
    document.getElementById('vertical-preview-image').src = images[0];
    document.getElementById('detail-title').textContent = currentWork.title;
    document.getElementById('detail-category').textContent = getCategoryName(currentWork.category);
    document.getElementById('detail-description').textContent = currentWork.description;

    renderThumbnails(images);

    const imageContainer = document.querySelector('.detail-image-container');
    if (imageContainer) {
        imageContainer.classList.remove('zoomed');
    }

    navigateTo('detail');
    
    setTimeout(initVerticalPreview, 100);
}

function initVerticalPreview() {
    const scrollContainer = document.getElementById('detail-image-scroll');
    const detailImage = document.getElementById('detail-image');
    const indicator = document.getElementById('vertical-preview-indicator');
    const verticalPreview = document.getElementById('detail-vertical-preview');
    
    if (!scrollContainer || !detailImage || !indicator || !verticalPreview) return;

    scrollContainer.scrollTop = 0;

    detailImage.onload = function() {
        updateIndicator();
    };

    if (detailImage.complete) {
        updateIndicator();
    }

    scrollContainer.addEventListener('scroll', function() {
        updateIndicator();
    });

    let dragStartY = 0;
    let indicatorStartTop = 0;

    indicator.style.pointerEvents = 'auto';
    
    indicator.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragStartY = e.clientY;
        const rect = indicator.getBoundingClientRect();
        const previewRect = verticalPreview.getBoundingClientRect();
        indicatorStartTop = rect.top - previewRect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaY = e.clientY - dragStartY;
        const newTop = indicatorStartTop + deltaY;
        
        const previewHeight = verticalPreview.offsetHeight;
        const indicatorHeight = indicator.offsetHeight;
        const maxTop = previewHeight - indicatorHeight;
        
        let clampedTop = Math.max(0, Math.min(maxTop, newTop));
        
        const scrollRatio = clampedTop / maxTop;
        const scrollContainer = document.getElementById('detail-image-scroll');
        if (scrollContainer) {
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            scrollContainer.scrollTop = scrollRatio * maxScroll;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    verticalPreview.addEventListener('click', function(e) {
        if (e.target === indicator) return;
        
        const rect = verticalPreview.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const previewHeight = verticalPreview.offsetHeight;
        const indicatorHeight = indicator.offsetHeight;
        
        let targetTop = clickY - indicatorHeight / 2;
        const maxTop = previewHeight - indicatorHeight;
        targetTop = Math.max(0, Math.min(maxTop, targetTop));
        
        const scrollRatio = targetTop / maxTop;
        const scrollContainer = document.getElementById('detail-image-scroll');
        if (scrollContainer) {
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            scrollContainer.scrollTop = scrollRatio * maxScroll;
        }
    });
}

function updateIndicator() {
    const scrollContainer = document.getElementById('detail-image-scroll');
    const detailImage = document.getElementById('detail-image');
    const indicator = document.getElementById('vertical-preview-indicator');
    
    if (!scrollContainer || !detailImage || !indicator) return;
    
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    const scrollTop = scrollContainer.scrollTop;
    
    const previewHeight = document.getElementById('detail-vertical-preview').offsetHeight;
    
    const indicatorHeight = (clientHeight / scrollHeight) * previewHeight;
    const indicatorTop = (scrollTop / scrollHeight) * previewHeight;
    
    indicator.style.height = Math.max(20, indicatorHeight) + 'px';
    indicator.style.top = indicatorTop + 'px';
}

function renderThumbnails(images) {
    const thumbsContainer = document.getElementById('detail-thumbs');
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = images.map((img, index) => `
        <div class="thumb-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${img}" alt="缩略图 ${index + 1}">
        </div>
    `).join('');

    thumbsContainer.querySelectorAll('.thumb-item').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            switchImage(index);
        });
    });
}

function switchImage(index) {
    if (!currentWork) return;
    const images = currentWork.images || [currentWork.image];
    if (index < 0 || index >= images.length) return;

    currentImageIndex = index;
    document.getElementById('detail-image').src = images[index];
    document.getElementById('vertical-preview-image').src = images[index];

    document.querySelectorAll('.thumb-item').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    setTimeout(initVerticalPreview, 100);
}

function initImageZoom() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (currentPage === 'detail') {
                navigateTo('works');
            }
        });
    }

    const imageContainer = document.querySelector('.detail-image-container');
    if (imageContainer) {
        imageContainer.addEventListener('click', (e) => {
            if (e.target.closest('.zoom-icon')) return;
            if (e.target.closest('.detail-vertical-preview')) return;
            if (imageContainer.classList.contains('zoomed')) {
                imageContainer.classList.remove('zoomed');
                imageContainer.scrollTop = 0;
            } else {
                imageContainer.classList.add('zoomed');
            }
        });
    }
}

function initScrollAnimations() {
    const cards = document.querySelectorAll('.work-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 20px rgba(163, 177, 198, 0.4)';
    } else {
        navbar.style.boxShadow = '0 4px 12px rgba(163, 177, 198, 0.3)';
    }
});

// 窗口大小变化时重新渲染作品
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        renderWorks();
    }, 250);
});

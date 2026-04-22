let currentPage = 'home';
let currentCategory = 'all';
let currentWork = null;
let documentClickListener = null; // 追踪文档点击监听器

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWorksFilter();
    initSearch();
    adjustSearchPosition();
    renderWorks();
    initScrollAnimations();
    initImageZoom();
    
    // 页面加载完成后再次调整位置，确保完全准确
    window.addEventListener('load', adjustSearchPosition);
});

// 动态调整搜索栏位置，确保与导航栏无缝衔接
function adjustSearchPosition() {
    const navbar = document.querySelector('.navbar');
    const fixedSearch = document.querySelector('.fixed-search');
    const main = document.querySelector('main');
    
    if (navbar && fixedSearch) {
        const navbarHeight = navbar.offsetHeight;
        fixedSearch.style.top = `${navbarHeight}px`;
        
        // 动态调整main的padding-top，确保内容不被遮挡
        if (main && fixedSearch) {
            const searchHeight = fixedSearch.offsetHeight;
            main.style.paddingTop = `${navbarHeight + searchHeight + 20}px`;
        }
    }
}

// 监听窗口大小变化，重新调整搜索栏位置
window.addEventListener('resize', adjustSearchPosition);

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    if (!searchInput || !searchBtn || !clearBtn) return;
    
    // 监听输入变化，显示/隐藏清除按钮
    searchInput.addEventListener('input', () => {
        clearBtn.style.display = searchInput.value ? 'flex' : 'none';
    });
    
    // 清除按钮功能
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        // 重置显示全部作品
        currentCategory = 'all';
        updateFilterButtons();
        renderWorks();
    });
    
    // 搜索按钮功能
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            currentCategory = 'all';
            navigateTo('works');

            // 先导航到页面，然后等页面切换完成后渲染搜索结果
            const waitForPage = () => {
                const worksPage = document.getElementById('works-page');
                if (worksPage && worksPage.classList.contains('active')) {
                    // 页面已激活，渲染搜索结果
                    const filteredWorks = worksData.filter(work => 
                        work.title.toLowerCase().includes(searchTerm) || 
                        work.description.toLowerCase().includes(searchTerm)
                    );
                    
                    const grids = [
                        document.getElementById('works-grid'),
                        document.getElementById('works-grid-page')
                    ];
                    
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
                            // 立即添加visible类，避免跳动
                            card.className = 'work-card visible';
                            card.dataset.id = work.id;
                            // 减少延迟时间
                            card.style.transitionDelay = `${Math.min(index * 0.03, 0.3)}s`;
                            card.innerHTML = `
                                <div class="work-info">
                                    <h3 class="work-title">${work.title}</h3>
                                    <p class="work-category">${getCategoryName(work.category)}</p>
                                </div>
                                <img src="${work.image}" alt="${work.title}" class="work-image" loading="lazy">
                            `;
                            
                            // 找到最短的列
                            const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
                            columns[shortestColumnIndex].appendChild(card);
                            
                            // 预估卡片高度（用于瀑布流）
                            columnHeights[shortestColumnIndex] += 300;
                            
                            card.addEventListener('click', () => {
                                const workId = parseInt(card.dataset.id);
                                showWorkDetail(workId);
                            });
                        });
                    });
                    
                    // 初始化滚动动画
                    initScrollAnimations();
                    updateFilterButtons();
                } else {
                    // 页面还未激活，继续等待
                    setTimeout(waitForPage, 50);
                }
            };
            
            waitForPage();  
        } else {
            // 如果没有搜索内容，显示全部作品
            currentCategory = 'all';
            updateFilterButtons();
            renderWorks();
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    
    // 使用keydown替代keypress，兼容性更好
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            performSearch();
        }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const logo = document.querySelector('.logo');
    const dropdown = document.querySelector('.dropdown');
    const worksLink = dropdown ? dropdown.querySelector('a[data-page="works"]') : null;

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

    // 为移动端添加下拉菜单点击切换功能
    if (worksLink) {
        worksLink.addEventListener('click', (e) => {
            // 如果当前在移动端，点击作品链接时切换下拉菜单
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');

                // 动态调整下拉菜单位置
                if (dropdown.classList.contains('active')) {
                    const navbar = document.querySelector('.navbar');
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    if (navbar && dropdownMenu) {
                        const navbarHeight = navbar.offsetHeight;
                        dropdownMenu.style.top = `${navbarHeight}px`;
                        dropdownMenu.style.transform = 'translateY(0)';
                    }
                }
            }
        });
    }

    const dropdownLinks = document.querySelectorAll('.dropdown-menu a[data-category]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            currentCategory = category;
            
            // 关闭下拉菜单
            closeDropdown();
         
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

    // 移除旧的文档点击监听器（如果存在）
    if (documentClickListener) {
        document.removeEventListener('click', documentClickListener);
    }

    // 点击页面其他地方关闭下拉菜单
    documentClickListener = (e) => {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    };
    document.addEventListener('click', documentClickListener);
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
            // 立即添加visible类，避免跳动
            card.className = 'work-card visible';
            card.dataset.id = work.id;
            // 减少延迟时间
            card.style.transitionDelay = `${Math.min(index * 0.03, 0.3)}s`;
            card.innerHTML = `
                <div class="work-info">
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-category">${getCategoryName(work.category)}</p>
                </div>
                <img src="${work.image}" alt="${work.title}" class="work-image" loading="lazy">
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

    // 仍然初始化滚动动画，用于后续可能添加的卡片
    initScrollAnimations();
}

// 关闭下拉菜单
function closeDropdown() {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
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

let scrollObserver = null;

function initScrollAnimations() {
    // 如果已经有观察器，先断开所有观察
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
 
    const cards = document.querySelectorAll('.work-card');
    
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 只在进入视口时添加visible类，离开时不移除
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.05, // 降低阈值，让卡片更容易进入
        rootMargin: '100px 0px 100px 0px' // 增加上下边距，提前加载
    });

    cards.forEach(card => {
        scrollObserver.observe(card);
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

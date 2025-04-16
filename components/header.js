class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="fixed w-full top-0 z-50 px-10 py-6 backdrop-blur-md bg-bg-primary/80">
                <div class="max-w-[2000px] mx-auto flex justify-between items-center">
                    <a href="index.html" class="text-2xl font-bold gradient-text">D.K</a>
                    <div class="flex items-center space-x-8">
                        <a href="index.html" class="text-text-secondary hover:text-white transition-colors nav-link">首页</a>
                        <a href="portfolio.html" class="text-text-secondary hover:text-white transition-colors nav-link">作品集</a>
                        <a href="about.html" class="text-text-secondary hover:text-white transition-colors nav-link">关于我</a>
                        <a href="contact.html" class="text-text-secondary hover:text-white transition-colors nav-link">联系我</a>
                    </div>
                </div>
            </nav>
        `;

        // 获取当前页面URL
        const currentPath = window.location.pathname;
        // 设置当前页面对应的导航链接为激活状态
        const navLinks = this.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if ((href === 'index.html' && (currentPath.endsWith('/index.html') || currentPath.endsWith('/'))) || currentPath.endsWith('/' + href)) {
                link.classList.remove('text-text-secondary');
                link.classList.add('text-white');
            }
        });
    }
}

customElements.define('dk-header', Header); 
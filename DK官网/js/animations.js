/**
 * 高级动画效果
 * 为网站添加更丰富的动效体验
 */

// 页面加载动画
function pageLoadAnimation() {
    // 获取所有有data-animate属性的元素
    const animateElements = document.querySelectorAll('[data-animate]');
    
    // 为每个元素添加淡入动画
    animateElements.forEach((element, index) => {
        // 设置初始状态
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // 设置延迟，使元素依次显示
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// 滚动视差效果增强
function enhancedParallax() {
    // 获取所有有data-parallax属性的元素
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const offset = scrollTop * speed;
            
            // 根据元素类型应用不同的视差效果
            if (element.classList.contains('parallax-bg')) {
                // 背景视差
                element.style.backgroundPositionY = `${offset}px`;
            } else {
                // 元素位置视差
                element.style.transform = `translateY(${offset}px)`;
            }
        });
    });
}

// 鼠标移动视差效果
function mouseMoveParallax() {
    const elements = document.querySelectorAll('[data-mouse-parallax]');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        elements.forEach(element => {
            const speed = element.getAttribute('data-mouse-parallax') || 0.1;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const offsetX = (mouseX - centerX) * speed;
            const offsetY = (mouseY - centerY) * speed;
            
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

// 图片加载淡入效果
function imageLoadFadeIn() {
    const images = document.querySelectorAll('img[data-fade-in]');
    
    images.forEach(img => {
        // 设置初始状态
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.8s ease';
        
        // 图片加载完成后淡入
        img.onload = function() {
            img.style.opacity = '1';
        };
        
        // 如果图片已经缓存，也应该显示
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// 滚动动画增强
function scrollAnimations() {
    const elements = document.querySelectorAll('[data-scroll-animate]');
    
    function checkInView() {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // 元素进入视口时
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                const animation = element.getAttribute('data-scroll-animate');
                element.classList.add(animation);
                element.classList.add('animated');
            }
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', checkInView);
    // 初始检查
    checkInView();
}

// 文本动画效果
function textAnimations() {
    const elements = document.querySelectorAll('[data-text-animate]');
    
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        // 逐字显示文本
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = '0';
            span.style.transition = `opacity 0.1s ease ${i * 0.05}s`;
            element.appendChild(span);
            
            // 触发重排以应用过渡
            setTimeout(() => {
                span.style.opacity = '1';
            }, 10);
        }
    });
}

// 初始化所有动画
function initAllAnimations() {
    // 页面加载完成后初始化动画
    window.addEventListener('DOMContentLoaded', () => {
        pageLoadAnimation();
        enhancedParallax();
        mouseMoveParallax();
        imageLoadFadeIn();
        scrollAnimations();
        textAnimations();
        
        console.log('所有动画已初始化');
    });
}

// 调用初始化函数
initAllAnimations(); 
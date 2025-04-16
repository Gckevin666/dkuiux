class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="py-24 px-10 bg-[#1C1C1C] border-t border-gray-800">
                <div class="max-w-[2000px] mx-auto">
                    <div class="flex flex-col md:flex-row justify-between">
                        <!-- 左侧信息 -->
                        <div class="space-y-12 md:w-1/3">
                            <div>
                                <h3 class="text-sm text-gray-400 mb-2">地点</h3>
                                <p class="text-white">中国广东省珠海市</p>
                            </div>
                            <div>
                                <h3 class="text-sm text-gray-400 mb-2">工作时间</h3>
                                <p class="text-white">9:00 - 18:00 [GMT+8]</p>
                            </div>
                            <div>
                                <h3 class="text-sm text-gray-400 mb-2">邮箱</h3>
                                <a href="mailto:1092609410@qq.com" class="text-white hover:text-gray-300 transition-colors">1092609410@qq.com</a>
                            </div>
                        </div>
                        
                        <!-- 右侧感谢语 -->
                        <div class="mt-12 md:mt-0 md:w-1/2">
                            <p class="text-sm text-gray-400 mb-4">设计有温度的界面</p>
                            <h2 class="main-heading mb-6">创造有价值的体验。</h2>
                            <div class="flex space-x-6 mb-12">
                                <a href="https://www.zcool.com.cn/u/14845241" target="_blank" class="text-gray-400 hover:text-white transition-colors">站酷</a>
                                <a href="https://dribbble.com/dkuiux" target="_blank" class="text-gray-400 hover:text-white transition-colors">Dribbble</a>
                                <a href="#" target="_blank" class="text-gray-400 hover:text-white transition-colors">Behance</a>
                            </div>
                            <div class="pt-12 border-t border-gray-800">
                                <p class="text-sm text-gray-400">©2024-2025 D.K UI/UE Designer 版权所有</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('dk-footer', Footer); 
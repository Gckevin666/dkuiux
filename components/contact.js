class Contact extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <section id="contact" class="py-48 px-10 bg-bg-secondary relative overflow-hidden">
                <div class="absolute inset-0 flow-effect opacity-10"></div>
                <div class="max-w-[2000px] mx-auto relative z-10">
                    <div class="flex flex-col md:flex-row justify-between">
                        <div class="md:w-1/2">
                            <div class="flex justify-between items-start mb-6 fade-up">
                                <h2 class="main-heading">感谢你浏览我的作品集，期待收到你的消息!</h2>
                            </div>
                            <p class="text-text-secondary text-lg md:text-xl mb-12 fade-up delay-200">希望进一步讨论潜在的合作机会（项目或全职），请随时联系我。</p>
                            <a href="./contact.html" class="btn fade-up delay-400">
                                联系我
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        </div>
                        <div class="md:w-1/2 flex justify-end">
                            <p class="text-lg text-text-secondary hidden md:block fade-up delay-200">让我们聊聊!</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('dk-contact', Contact); 
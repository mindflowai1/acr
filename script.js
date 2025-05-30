// Função para mostrar mensagem de feedback
function showMessage(message, isError = false) {
    // Remove mensagens existentes
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cria a mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    messageDiv.innerHTML = `
        <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insere a mensagem antes do formulário
    const form = document.getElementById('contato-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do DOM
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeScrollElements = document.querySelectorAll('.fade-scroll');
    const contatoSection = document.getElementById('contato');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Variáveis para controle de scroll
    let lastScrollTop = 0;
    const scrollThreshold = 5;
    let isNavbarVisible = true;
    let scrollDebounce = null;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Inicialização - Forçar a cor branca do menu
    if (navbar) {
        navbar.classList.add('show-nav');
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.background = '#ffffff';
        navbar.setAttribute('style', 'background-color: #ffffff !important; background: #ffffff !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);');
    }
    
    // Animações iniciais
    setTimeout(() => {
        fadeElements.forEach(element => {
            element.classList.add('animate');
        });
    }, 300);
    
    // Smooth scroll ao clicar no indicador de rolagem
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const sobreSection = document.getElementById('sobre');
            if (sobreSection) {
                sobreSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ===== FUNÇÕES =====
    
    // Animação de elementos ao scroll
    function checkScrollAnimation() {
        fadeScrollElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.85;
            
            if (elementPosition < triggerPoint) {
                element.classList.add('visible');
            }
        });
    }
    
    // Efeito parallax na seção de contato
    function handleContactParallax() {
        if (contatoSection) {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const sectionTop = contatoSection.getBoundingClientRect().top + scrollPosition;
            const sectionHeight = contatoSection.offsetHeight;
            
            // Calcular visibilidade
            let visibilityRatio = 0;
            
            if (scrollPosition + windowHeight > sectionTop) {
                visibilityRatio = Math.min(
                    (scrollPosition + windowHeight - sectionTop) / (windowHeight + sectionHeight),
                    1
                );
            }
            
            // Aplicar efeitos baseados na visibilidade
            const opacity = 0.15 + (visibilityRatio * 0.25);
            const scale = 1.05 - (visibilityRatio * 0.05);
            
            contatoSection.style.setProperty('--bg-opacity', opacity);
            contatoSection.style.setProperty('--bg-scale', scale);
        }
    }
    
    // Detectar se está em versão desktop
    function isDesktop() {
        return window.innerWidth > 768;
    }
    
    // Detectar seção atual e atualizar link ativo
    function setActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 20;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Mostrar/esconder menu conforme rolagem
    function handleNavbarVisibility() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Manter fundo branco, ajustar sombra
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.background = '#ffffff';
        
        if (currentScrollTop > 50) {
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        // Mostrar/esconder menu ao rolar (tanto em desktop quanto mobile)
        if (currentScrollTop > 100) {
            const scrollDifference = currentScrollTop - lastScrollTop;
            
            if (Math.abs(scrollDifference) > scrollThreshold) {
                // Rolando para baixo - esconder menu
                if (scrollDifference > 0 && isNavbarVisible) {
                    navbar.classList.remove('show-nav');
                    navbar.classList.add('hide-nav');
                    isNavbarVisible = false;
                    
                    // Se o menu mobile estiver aberto, fechá-lo também
                    if (navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        
                        // Remover o overlay também ao rolar
                        if (menuOverlay) {
                            menuOverlay.classList.remove('active');
                        }
                    }
                } 
                // Rolando para cima - mostrar menu
                else if (scrollDifference < 0 && !isNavbarVisible) {
                    navbar.classList.remove('hide-nav');
                    navbar.classList.add('show-nav');
                    isNavbarVisible = true;
                }
            }
        } else if (currentScrollTop <= 100) {
            // No topo da página, sempre mostrar menu
            navbar.classList.remove('hide-nav');
            navbar.classList.add('show-nav');
            isNavbarVisible = true;
        }
        
        // Salvar posição atual para próxima verificação
        lastScrollTop = currentScrollTop;
    }
    
    // ===== EVENTOS =====
    
    // Envio do formulário
    const contactForm = document.getElementById('contato-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            try {
                // Mostrar loading no botão
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                // Enviar dados para o Google Apps Script
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Necessário para o Google Apps Script
                });
                
                // Se chegou aqui, o envio foi bem-sucedido
                showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', false);
                this.reset(); // Limpa o formulário
                
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showMessage('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde ou entre em contato por telefone.', true);
            } finally {
                // Restaurar botão
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
    
    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Mostrar/esconder o overlay
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
    });
    
    // Fechar o menu ao clicar no overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuOverlay.classList.remove('active');
        });
    }
    
    // Navegação ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Fechar menu mobile ao clicar
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Remover overlay também
            if (menuOverlay) {
                menuOverlay.classList.remove('active');
            }
            
            // Scroll suave para a seção
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Evento de scroll otimizado
    window.addEventListener('scroll', function() {
        if (scrollDebounce) {
            window.cancelAnimationFrame(scrollDebounce);
        }
        
        scrollDebounce = window.requestAnimationFrame(function() {
            handleNavbarVisibility();
            checkScrollAnimation();
            handleContactParallax();
            setActiveNavLink();
        });
    });
    
    // Evento de redimensionar janela
    window.addEventListener('resize', function() {
        if (!isDesktop()) {
            navbar.classList.remove('hide-nav');
            navbar.classList.add('show-nav');
            isNavbarVisible = true;
        } else {
            handleNavbarVisibility();
        }
    });
    
    // ===== INICIALIZAÇÃO =====
    handleNavbarVisibility();
    checkScrollAnimation();
    handleContactParallax();
    setActiveNavLink();
});

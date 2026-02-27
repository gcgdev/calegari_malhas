# Calegari Malhas Website

Repository: `https://github.com/gcgdev/calegari_malhas`

## English

### Overview
Institutional website for **Calegari Malhas**, with an additional conversion page focused on wholesale fabric sales.
The project is fully static and production-ready, built with semantic HTML, custom CSS, and vanilla JavaScript.

### Pages
- `index.html`: institutional/home page
- `atacado-de-malhas.html`: wholesale conversion page

### Tech Stack
- HTML5
- CSS3 (custom, responsive)
- Vanilla JavaScript (no frontend framework)
- PWA (`manifest.json` + `sw.js`)
- Google Analytics / Google Ads integration ready (`assets/analytics.js`)

### Main Features
- Responsive layout (desktop/mobile)
- SEO metadata (title, description, canonical, Open Graph)
- Structured data (JSON-LD for LocalBusiness, Service, FAQPage)
- WhatsApp-driven contact and quote flows
- Continuous factory image carousel
- Social proof section (customer reviews)

### Performance and Optimization
- WebP image delivery with JPG fallback using `<picture>`
- Native lazy loading (`loading="lazy"`) for non-critical images
- IntersectionObserver for section reveal and lazy-media fade-in
- Preserved intrinsic image dimensions (`width` / `height`) to reduce CLS
- Cache-first Service Worker strategy for static assets
- Lightweight glassmorphism styling with fallback for unsupported browsers

### PWA
- `manifest.json` with app metadata and icons
- Install prompt support via `beforeinstallprompt`
- Service Worker registration and offline cache
- Standalone mode support

### Analytics Configuration
Analytics placeholders are configured in both HTML files:
- `window.CALEGARI_ANALYTICS.ga4Id`
- `window.CALEGARI_ANALYTICS.adsId`
- `window.CALEGARI_ANALYTICS.adsConversions`

Tracking logic is implemented in:
- `assets/analytics.js`

### Project Structure
```text
Calegari Malhas/
  index.html
  atacado-de-malhas.html
  manifest.json
  sw.js
  readme.md
  assets/
    site.css
    site.js
    analytics.js
    img/
    icon/
    icons/
```

### Run Locally
Use localhost (required for full PWA behavior):

```bash
python -m http.server 8080
```

Then open:
- `http://localhost:8080/`

### Deployment
This project can be deployed directly to any static host (GitHub Pages, Netlify, Vercel static, traditional cPanel hosting, CDN buckets).

### Notes
- No build step is required.
- No React/Next/Vue or external UI libraries are used.
- Fonts and Google tag scripts are loaded from external providers at runtime.

---

## Português

### Visão Geral
Site institucional da **Calegari Malhas**, com uma página adicional focada em conversão para compra de malhas no atacado.
O projeto é totalmente estático e pronto para produção, desenvolvido com HTML semântico, CSS customizado e JavaScript puro.

### Páginas
- `index.html`: página institucional/principal
- `atacado-de-malhas.html`: página de conversão para atacado

### Tecnologias
- HTML5
- CSS3 (customizado e responsivo)
- JavaScript Vanilla (sem framework frontend)
- PWA (`manifest.json` + `sw.js`)
- Integração preparada para Google Analytics / Google Ads (`assets/analytics.js`)

### Principais Funcionalidades
- Layout responsivo (desktop/mobile)
- Metadados de SEO (title, description, canonical, Open Graph)
- Dados estruturados (JSON-LD para LocalBusiness, Service e FAQPage)
- Fluxos de contato e orçamento via WhatsApp
- Carrossel contínuo de fotos da fábrica
- Seção de prova social (avaliações de clientes)

### Performance e Otimizações
- Entrega de imagens em WebP com fallback JPG via `<picture>`
- Lazy loading nativo (`loading="lazy"`) em imagens não críticas
- IntersectionObserver para animações de seção e fade-in de mídia
- Dimensões intrínsecas de imagem (`width` / `height`) para reduzir CLS
- Estratégia cache-first no Service Worker para assets estáticos
- Glassmorphism leve com fallback para navegadores sem suporte

### PWA
- `manifest.json` com metadados e ícones do app
- Suporte a prompt de instalação com `beforeinstallprompt`
- Registro de Service Worker e cache offline
- Suporte ao modo standalone

### Configuração de Analytics
Os placeholders de analytics ficam nos dois HTMLs:
- `window.CALEGARI_ANALYTICS.ga4Id`
- `window.CALEGARI_ANALYTICS.adsId`
- `window.CALEGARI_ANALYTICS.adsConversions`

A lógica de rastreamento está em:
- `assets/analytics.js`

### Estrutura do Projeto
```text
Calegari Malhas/
  index.html
  atacado-de-malhas.html
  manifest.json
  sw.js
  readme.md
  assets/
    site.css
    site.js
    analytics.js
    img/
    icon/
    icons/
```

### Executar Localmente
Use localhost (necessário para comportamento completo de PWA):

```bash
python -m http.server 8080
```

Depois acesse:
- `http://localhost:8080/`

### Deploy
O projeto pode ser publicado diretamente em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel estático, cPanel, buckets CDN).

### Observações
- Não existe etapa de build.
- Não usa React/Next/Vue nem bibliotecas externas de UI.
- Fontes e scripts do Google são carregados de provedores externos em tempo de execução.

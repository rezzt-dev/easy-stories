// js/canvas-generator.js

// Usar el namespace global EASYSTORY para obtener el estado y configuración
(function() {
  /**
   * Genera la imagen de vista previa en el canvas
   */
  function generateImage() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.warn('Canvas no encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Obtener configuración y canción seleccionada
    const song = window.EASYSTORY?.getSelectedSong?.();
    const config = window.CANVAS_CONFIG;
    const styles = window.STYLES;

    if (!song || !config || !styles) {
      console.warn('Datos insuficientes para generar la imagen');
      if (!config || !styles) {
        setTimeout(() => generateImage(), 100);
      }
      return;
    }

    // Configuración responsive del canvas
    const isSmallScreen = window.innerWidth < 768;
    const canvasScale = isSmallScreen ? 0.8 : 1;
  
    canvas.width = config.width * canvasScale;
    canvas.height = config.height * canvasScale;
  
    // Escalar el contexto para mantener proporciones
    ctx.scale(canvasScale, canvasScale);

    const selectedStyleKey = document.getElementById('styleSelect')?.value || 'minimal-black';
    const style = styles[selectedStyleKey] || styles['minimal-black'];
    const customText = document.getElementById('customText')?.value?.trim() || '';

    // Control de rejilla en body según tema
    document.body.classList.toggle('no-grid-bg', isLightTheme(selectedStyleKey));

    // Fondo y patrones
    drawBackground(ctx, style);
    drawAmbientLight(ctx, style);
    drawPattern(ctx, style);

    // Imagen de portada
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        drawCard(ctx, style);

        // Portada con sombra y borde
        drawAlbumCover(ctx, img, style);

        // Badges superiores (año + tema)
        drawBadges(ctx, style, selectedStyleKey, song);

        // Título de la canción
        drawSongTitle(ctx, style, song);

        // Nombre del artista (sin avatar)
        drawArtistName(ctx, style, song);

        // Texto personalizado (si existe)
        drawCustomText(ctx, style, customText);

        // Logo Spotify (abajo izquierda)
        drawSpotifyLogo(ctx, style);

        const previewEmpty = document.querySelector('.preview-empty');
        if (previewEmpty) previewEmpty.classList.add('hidden');
        canvas.classList.remove('hidden');
      } catch (error) {
        console.error('Error generando la imagen:', error);
      }
    };

    img.onerror = () => console.error('Error al cargar imagen del álbum');

    img.src = song?.album?.images?.[0]?.url || '';
  }

  function isLightTheme(key) {
    return ['minimal-white', 'pure-light', 'macos-light', 'cherry-blossom'].includes(key);
  }

  function drawBackground(ctx, style) {
    const { width, height } = CANVAS_CONFIG;

    ctx.save();
    if (style.kind === 'gradient' && Array.isArray(style.gradientStops)) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      for (const stop of style.gradientStops) {
        gradient.addColorStop(stop.pos, stop.color);
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = style.background || '#0a0a0a';
    }
    ctx.fillRect(0, 0, width, height);

    // Viñeta
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.2,
      width / 2, height / 2, width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawAmbientLight(ctx, style) {
    const { width, height } = CANVAS_CONFIG;
    ctx.save();
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.28, 0, width * 0.5, height * 0.28, width * 0.7);
    glow.addColorStop(0, style.overlayGlow || 'rgba(16,185,129,0.10)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawPattern(ctx, style) {
    if (style.noPattern || style.pattern === 'none') return;

    const { width, height } = CANVAS_CONFIG;
    ctx.save();

    if (style.pattern === 'softGrid') {
      ctx.globalAlpha = 0.22;
      drawGrid(ctx, 60, style.accent || '#22d3ee');
    } else if (style.pattern === 'bars') {
      ctx.globalAlpha = 0.08;
      const barWidth = 24;
      for (let x = -200; x < width + 200; x += 120) {
        const grad = ctx.createLinearGradient(x, 0, x + barWidth, height);
        grad.addColorStop(0, style.accent || '#10b981');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, barWidth, height);
      }
    } else if (style.pattern === 'bokeh') {
      for (let i = 0; i < 18; i++) {
        const r = rand(40, 130);
        const x = rand(0, width);
        const y = rand(0, height * 0.7);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.08)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    } else if (style.pattern === 'neonGrid') {
      ctx.globalAlpha = 0.18;
      drawGrid(ctx, 70, style.accent2 || '#a78bfa');
    }

    ctx.restore();
  }

  function drawGrid(ctx, step = 60, color = '#22d3ee') {
    const { width, height } = CANVAS_CONFIG;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();
  }

  function drawCard(ctx, style) {
    const { card } = CANVAS_CONFIG;
    ctx.save();
    ctx.shadowColor = style.cardShadow || 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    roundRect(ctx, card.x, card.y, card.width, card.height, card.radius);
    ctx.fillStyle = style.cardBg || 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.restore();
  }

  function drawAlbumCover(ctx, img, style) {
    const { card, cover } = CANVAS_CONFIG;
    const x = card.x + 50;
    const y = card.y + 50;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 16;

    roundRect(ctx, x, y, cover.size, cover.size, cover.radius);
    ctx.clip();
    ctx.drawImage(img, x, y, cover.size, cover.size);
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    roundRect(ctx, x, y, cover.size, cover.size, cover.radius);
    ctx.stroke();
    ctx.restore();
  }

  function drawBadges(ctx, style, key, song) {
    const { card, cover } = CANVAS_CONFIG;
    const startX = card.x + 50 + cover.size + 30;
    const y = card.y + 50;

    const badges = [];
    const year = extractYear(song?.album?.release_date);
    if (year) badges.push({ label: `${year}`, bg: style.badgeBg, color: style.badgeText });
    badges.push({ label: formatStyleKey(key), bg: style.badgeBg, color: style.badgeText });

    ctx.save();
    let x = startX;

    for (const b of badges) {
      const padX = 12, padY = 6;
      const font = '600 18px Poppins, sans-serif';
      ctx.font = font;
      const w = ctx.measureText(b.label).width + padX * 2;
      const h = 30;

      ctx.fillStyle = b.bg || 'rgba(255,255,255,0.15)';
      roundRect(ctx, x, y, w, h, 15);
      ctx.fill();

      ctx.fillStyle = b.color || '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.label, x + padX, y + h / 2);
      x += w + 10;
    }
    ctx.restore();
  }

  function drawSongTitle(ctx, style, song) {
    const { card, cover } = CANVAS_CONFIG;
    const x = card.x + 50 + cover.size + 30;
    const y = card.y + 145;
    const maxWidth = card.width - cover.size - 110;

    const title = song?.name || 'Unknown Title';
    let fontSize = 48;
    ctx.font = `700 ${fontSize}px Poppins, sans-serif`;
    ctx.fillStyle = style.textColor || '#fff';

    while (ctx.measureText(title).width > maxWidth && fontSize > 24) {
      fontSize -= 2;
      ctx.font = `700 ${fontSize}px Poppins, sans-serif`;
    }

    wrapText(ctx, title, x, y, maxWidth, fontSize + 6, 2);
  }

  function drawArtistName(ctx, style, song) {
    const { card, cover } = CANVAS_CONFIG;
    const x = card.x + 50 + cover.size + 30;
    const y = card.y + 190;
    const artists = (song?.artists || []).map(a => a.name).join(', ');
    const maxWidth = card.width - cover.size - 110;

    ctx.fillStyle = style.subtitleColor || '#a3a3a3';
    ctx.font = '500 32px Poppins, sans-serif';
    wrapText(ctx, artists || 'Unknown Artist', x, y, maxWidth, 38, 2);
  }

  function drawCustomText(ctx, style, customText) {
    if (!customText) return;
    const { card } = CANVAS_CONFIG;
    ctx.fillStyle = style.customTextColor || style.textColor || '#fff';
    ctx.font = '600 28px Poppins, sans-serif';
    wrapText(ctx, customText, card.x + 50, card.y + card.height - 300, card.width - 100, 36, 3);
  }

  function drawSpotifyLogo(ctx, style) {
    const { card } = CANVAS_CONFIG;
    const x = card.x + 50;
    const y = card.y + card.height - 65;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 14, y + 14, 14, 0, Math.PI * 2);
    ctx.fillStyle = style.accent || '#1DB954';
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + 14, y + 14, 5 + i * 3, 0.6, 2.5);
      ctx.stroke();
    }

    ctx.fillStyle = style.textColor || '#fff';
    ctx.font = '700 26px Poppins, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('Spotify', x + 40, y + 14);
    ctx.restore();
  }

  /* === UTILIDADES === */

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = (text || '').split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && n > 0) {
        if (lineCount < maxLines - 1) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
          lineCount++;
        } else {
          ctx.fillText(line.trim() + '…', x, y);
          return;
        }
      } else {
        line = testLine;
      }
    }
    if (lineCount < maxLines) ctx.fillText(line, x, y);
  }

  function extractYear(dateStr) {
    return dateStr ? String(dateStr).slice(0, 4) : null;
  }

  function formatStyleKey(key) {
    return key ? key.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase()) : '';
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Exponer función al namespace global
  window.generateImage = generateImage;
})();
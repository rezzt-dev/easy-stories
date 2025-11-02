// js/main.js

// Creamos un único namespace global si no existe
window.EASYSTORY = window.EASYSTORY || {};

(() => {
  // Estado privado de la aplicación
  const STATE = {
    accessToken: '',
    selectedSong: null
  };

  /**
   * Conecta con la API de Spotify usando las credenciales proporcionadas
   */
  async function connectSpotify() {
    const clientId = document.getElementById('clientId')?.value?.trim();
    const clientSecret = document.getElementById('clientSecret')?.value?.trim();
    const connectBtn = document.getElementById('connectBtn');

    // Validación de credenciales
    if (!clientId || !clientSecret) {
      showNotification('Por favor, introduce las credenciales de Spotify', 'error');
      return;
    }

    // Mostrar estado de carga
    if (connectBtn) {
      connectBtn.classList.add('loading');
      connectBtn.disabled = true;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorData = await safeJson(response);
        console.error('Error de Spotify:', errorData);

        let errorMessage = 'Error al conectar con Spotify';
        if (response.status === 401) {
          errorMessage = 'Credenciales inválidas. Verifica tu Client ID y Secret';
        } else if (errorData?.error_description) {
          errorMessage = errorData.error_description;
        }

        showNotification(errorMessage, 'error');
        return;
      }

      const data = await response.json();

      if (!data.access_token) {
        console.error('No se recibió access token:', data);
        showNotification('Error: No se recibió el token de acceso', 'error');
        return;
      }

      STATE.accessToken = data.access_token;
      console.log('✅ Conectado exitosamente a Spotify');

      showNotification('¡Conectado a Spotify exitosamente!', 'success');

      // Transición suave entre cards
      transitionToSearch();

    } catch (error) {
      console.error('Error completo:', error);
      showNotification('Error de red al conectar con Spotify', 'error');
    } finally {
      // Restaurar estado del botón
      if (connectBtn) {
        connectBtn.classList.remove('loading');
        connectBtn.disabled = false;
      }
    }
  }

  /**
   * Transición suave de credenciales a búsqueda
   */
  function transitionToSearch() {
    const credentialsCard = document.getElementById('credentialsCard');
    const searchCard = document.getElementById('searchCard');

    if (credentialsCard) {
      credentialsCard.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        credentialsCard.classList.add('hidden');
        if (searchCard) {
          searchCard.classList.remove('hidden');
          // Focus automático en el input de búsqueda
          const searchInput = document.getElementById('searchQuery');
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
          }
        }
      }, 300);
    }
  }

  /**
   * Busca canciones en Spotify según la query del usuario
   */
  async function searchSongs() {
    const queryInput = document.getElementById('searchQuery');
    const query = queryInput?.value?.trim();

    if (!query) {
      showNotification('Escribe algo para buscar', 'info');
      return;
    }

    if (!STATE.accessToken) {
      showNotification('Primero debes conectar con Spotify', 'error');
      return;
    }

    const searchBtn = document.getElementById('searchBtn');
    const resultsDiv = document.getElementById('searchResults');

    // Mostrar estado de carga
    if (searchBtn) {
      searchBtn.classList.add('loading');
      searchBtn.disabled = true;
    }

    if (resultsDiv) {
      resultsDiv.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">🔍 Buscando...</div>';
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10&market=ES`,
        {
          headers: {
            'Authorization': `Bearer ${STATE.accessToken}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showNotification('Token expirado. Vuelve a conectar', 'error');
          resetToCredentials();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tracks = data.tracks?.items || [];

      if (tracks.length === 0) {
        showNotification('No se encontraron resultados', 'info');
        if (resultsDiv) {
          resultsDiv.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">😕 No se encontraron canciones</div>';
        }
      } else {
        displayResults(tracks);
        showNotification(`Se encontraron ${tracks.length} canciones`, 'success');
      }

    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al buscar canciones', 'error');
      if (resultsDiv) {
        resultsDiv.innerHTML = '';
      }
    } finally {
      // Restaurar estado del botón
      if (searchBtn) {
        searchBtn.classList.remove('loading');
        searchBtn.disabled = false;
      }
    }
  }

  /**
   * Muestra los resultados de la búsqueda
   * @param {Array} tracks - Array de tracks de Spotify
   */
  function displayResults(tracks) {
    const resultsDiv = document.getElementById('searchResults');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';

    tracks.forEach((track, index) => {
      const songDiv = document.createElement('div');
      songDiv.className = 'song-item';
      songDiv.setAttribute('role', 'button');
      songDiv.setAttribute('tabindex', '0');
      songDiv.setAttribute('data-track-id', track.id);

      // Click y teclado para accesibilidad
      songDiv.addEventListener('click', (e) => selectSong(track, e.currentTarget));
      songDiv.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectSong(track, e.currentTarget);
        }
      });

      // Obtener imagen (priorizar tamaño medio)
      const albumImage = track.album?.images?.[1]?.url ||
        track.album?.images?.[2]?.url ||
        track.album?.images?.[0]?.url ||
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23333" width="64" height="64"/%3E%3C/svg%3E';

      // Obtener artistas
      const artists = (track.artists || []).map(a => a.name).join(', ');

      songDiv.innerHTML = `
        <img src="${albumImage}" 
             alt="${escapeHtml(track.name)}" 
             loading="lazy"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect fill=%22%23333%22 width=%2264%22 height=%2264%22/%3E%3C/svg%3E'">
        <div class="song-info">
          <div class="song-title" title="${escapeHtml(track.name)}">${escapeHtml(track.name)}</div>
          <div class="song-artist" title="${escapeHtml(artists)}">${escapeHtml(artists)}</div>
        </div>
      `;

      // Animación de entrada escalonada
      songDiv.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;

      resultsDiv.appendChild(songDiv);
    });
  }

  /**
   * Selecciona una canción y genera la imagen
   * @param {Object} song - Objeto de canción de Spotify
   * @param {HTMLElement} selectedElement - Elemento DOM seleccionado
   */
  function selectSong(song, selectedElement) {
    if (!song) return;

    STATE.selectedSong = song;

    // Remover selección previa
    document.querySelectorAll('.song-item').forEach(item => {
      item.classList.remove('selected');
      item.setAttribute('aria-selected', 'false');
    });

    // Marcar como seleccionado
    if (selectedElement) {
      selectedElement.classList.add('selected');
      selectedElement.setAttribute('aria-selected', 'true');
    }

    // Mostrar card de personalización
    const customCard = document.getElementById('customCard');
    if (customCard) {
      customCard.classList.remove('hidden');

      // Scroll suave hacia la vista previa en móviles
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const previewContainer = document.getElementById('previewContainer');
          if (previewContainer) {
            previewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 300);
      }
    }

    // Generar imagen
    try {
      function safeGenerate() {
      if (window.CANVAS_CONFIG && window.STYLES && typeof generateImage === 'function') {
        generateImage();
        showNotification(`Seleccionada: ${song.name}`, 'success');
      } else {
        setTimeout(safeGenerate, 50);
      }
    }
    safeGenerate();
    } catch (error) {
      console.error('Error generating image:', error);
      showNotification('Error al generar la imagen', 'error');
    }
  }

  /**
   * Resetea la interfaz al estado de credenciales
   */
  function resetToCredentials() {
    STATE.accessToken = '';
    STATE.selectedSong = null;

    const credentialsCard = document.getElementById('credentialsCard');
    const searchCard = document.getElementById('searchCard');
    const customCard = document.getElementById('customCard');
    const canvas = document.getElementById('canvas');
    const previewEmpty = document.querySelector('.preview-empty');
    const resultsDiv = document.getElementById('searchResults');

    if (credentialsCard) credentialsCard.classList.remove('hidden');
    if (searchCard) searchCard.classList.add('hidden');
    if (customCard) customCard.classList.add('hidden');
    if (canvas) canvas.classList.add('hidden');
    if (previewEmpty) previewEmpty.classList.remove('hidden');
    if (resultsDiv) resultsDiv.innerHTML = '';

    // Limpiar inputs
    const clientIdInput = document.getElementById('clientId');
    const clientSecretInput = document.getElementById('clientSecret');
    const searchQueryInput = document.getElementById('searchQuery');

    if (clientIdInput) clientIdInput.value = '';
    if (clientSecretInput) clientSecretInput.value = '';
    if (searchQueryInput) searchQueryInput.value = '';
  }

  /**
   * Escapa HTML para prevenir XSS
   * @param {string} text - Texto a escapar
   * @returns {string} - Texto escapado
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return (text ?? '').toString().replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Intenta parsear JSON de forma segura sin lanzar excepción
   */
  async function safeJson(response) {
    try {
      return await response.clone().json();
    } catch {
      return null;
    }
  }

  /**
   * Muestra notificaciones al usuario
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, info)
   */
  function showNotification(message, type = 'info') {
    // Si existe una función global showNotification, usarla
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
      return;
    }

    // Fallback: console log
    const emoji = { success: '✅', error: '❌', info: 'ℹ️' }[type] || 'ℹ️';
    console.log(`${emoji} ${message}`);
  }

  /**
   * Autocompletar credenciales (para desarrollo)
   */
  async function autofillCredentials() {
    const clientIdInput = document.getElementById('clientId');
    const clientSecretInput = document.getElementById('clientSecret');
      
    if (clientIdInput) {
      clientIdInput.value = '14c6b71a2c3143eea64cc495963fd6cb';
    }
    if (clientSecretInput) {
      clientSecretInput.value = 'dbd3a5e98fbe429f8e84b3cbda1a93c1';
    }
      
    showNotification('Credenciales autocompletadas', 'success');
    await connectSpotify();
  }

  /**
   * Inicializa los event listeners
   */
  function initEventListeners() {
    // Botón de conectar
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
      connectBtn.addEventListener('click', connectSpotify);
    }

    // Botón de autocompletar
    const autofillBtn = document.getElementById('autofillBtn');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', autofillCredentials);
    }

    // Botón de búsqueda
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', searchSongs);
    }

    // Enter en input de búsqueda
    const searchQuery = document.getElementById('searchQuery');
    if (searchQuery) {
      searchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          searchSongs();
        }
      });
    }

    // Enter en inputs de credenciales
    const clientId = document.getElementById('clientId');
    const clientSecret = document.getElementById('clientSecret');
    
    if (clientId) {
      clientId.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clientSecret?.focus();
        }
      });
    }
    
    if (clientSecret) {
      clientSecret.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          connectSpotify();
        }
      });
    }

    // Contador de caracteres para texto personalizado
    const customText = document.getElementById('customText');
    const charCounter = document.getElementById('charCounter');
    if (customText && charCounter) {
      customText.addEventListener('input', () => {
        const length = customText.value.length;
        charCounter.textContent = `${length}/50`;
        if (length >= 50) {
          charCounter.style.color = 'var(--error)';
        } else {
          charCounter.style.color = 'var(--text-secondary)';
        }
      });
    }

    // Cambio de estilo
    const styleSelect = document.getElementById('styleSelect');
    if (styleSelect) {
      styleSelect.addEventListener('change', () => {
        if (STATE.selectedSong && typeof generateImage === 'function') {
          generateImage();
        }
      });
    }

    // Cambio de texto personalizado
    if (customText) {
      customText.addEventListener('input', () => {
        if (STATE.selectedSong && typeof generateImage === 'function') {
          generateImage();
        }
      });
    }

    // Botón de descarga
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        if (!canvas || canvas.classList.contains('hidden')) {
          showNotification('Primero selecciona una canción', 'error');
          return;
        }

        try {
          const link = document.createElement('a');
          const songName = STATE.selectedSong?.name || 'spotify-story';
          link.download = `${songName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          showNotification('Imagen descargada correctamente', 'success');
        } catch (error) {
          console.error('Error al descargar:', error);
          showNotification('Error al descargar la imagen', 'error');
        }
      });
    }
  }

  // Inyectar animación CSS (solo una vez)
  function injectStyles() {
    const KEY_ID = 'slideout-anim-style';
    if (!document.getElementById(KEY_ID)) {
      const style = document.createElement('style');
      style.id = KEY_ID;
      style.textContent = `
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Exponer funciones y estado al namespace global
  window.EASYSTORY.connectSpotify = connectSpotify;
  window.EASYSTORY.searchSongs = searchSongs;
  window.EASYSTORY.selectSong = selectSong;
  window.EASYSTORY.resetToCredentials = resetToCredentials;
  window.EASYSTORY.getState = () => ({ ...STATE }); // Solo lectura
  window.EASYSTORY.getAccessToken = () => STATE.accessToken;
  window.EASYSTORY.getSelectedSong = () => STATE.selectedSong;

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      initEventListeners();
      console.log('🎵 EASY STORY inicializado correctamente');
    });
  } else {
    injectStyles();
    initEventListeners();
    console.log('🎵 EASY STORY inicializado correctamente');
  }

})();
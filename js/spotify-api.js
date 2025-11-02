// js/spotify-api.js

/**
 * Módulo de API de Spotify
 * Proporciona funciones auxiliares para interactuar con la API de Spotify
 * No declara variables globales para evitar conflictos con main.js
 */

(function() {
  'use strict';

  /**
   * Obtiene un token de acceso de Spotify usando Client Credentials Flow
   * @param {string} clientId - Client ID de Spotify
   * @param {string} clientSecret - Client Secret de Spotify
   * @returns {Promise<string|null>} - Access token o null si falla
   */
  async function getSpotifyToken(clientId, clientSecret) {
    if (!clientId || !clientSecret) {
      console.error('Client ID y Client Secret son requeridos');
      return null;
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
        return null;
      }

      const data = await response.json();
      return data.access_token || null;

    } catch (error) {
      console.error('Error al obtener token de Spotify:', error);
      return null;
    }
  }

  /**
   * Busca canciones en Spotify
   * @param {string} query - Término de búsqueda
   * @param {string} accessToken - Token de acceso de Spotify
   * @param {number} limit - Número máximo de resultados (default: 10)
   * @param {string} market - Código de mercado ISO (default: 'ES')
   * @returns {Promise<Array|null>} - Array de tracks o null si falla
   */
  async function searchSpotifyTracks(query, accessToken, limit = 10, market = 'ES') {
    if (!query || !accessToken) {
      console.error('Query y accessToken son requeridos');
      return null;
    }

    try {
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=${market}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Token expirado o inválido');
        }
        return null;
      }

      const data = await response.json();
      return data.tracks?.items || [];

    } catch (error) {
      console.error('Error al buscar canciones:', error);
      return null;
    }
  }

  /**
   * Obtiene información detallada de una canción por su ID
   * @param {string} trackId - ID de la canción en Spotify
   * @param {string} accessToken - Token de acceso de Spotify
   * @returns {Promise<Object|null>} - Objeto de track o null si falla
   */
  async function getSpotifyTrack(trackId, accessToken) {
    if (!trackId || !accessToken) {
      console.error('trackId y accessToken son requeridos');
      return null;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('Error al obtener track:', response.status);
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error al obtener información de la canción:', error);
      return null;
    }
  }

  /**
   * Obtiene información de un artista por su ID
   * @param {string} artistId - ID del artista en Spotify
   * @param {string} accessToken - Token de acceso de Spotify
   * @returns {Promise<Object|null>} - Objeto de artista o null si falla
   */
  async function getSpotifyArtist(artistId, accessToken) {
    if (!artistId || !accessToken) {
      console.error('artistId y accessToken son requeridos');
      return null;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('Error al obtener artista:', response.status);
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error al obtener información del artista:', error);
      return null;
    }
  }

  /**
   * Obtiene información de un álbum por su ID
   * @param {string} albumId - ID del álbum en Spotify
   * @param {string} accessToken - Token de acceso de Spotify
   * @returns {Promise<Object|null>} - Objeto de álbum o null si falla
   */
  async function getSpotifyAlbum(albumId, accessToken) {
    if (!albumId || !accessToken) {
      console.error('albumId y accessToken son requeridos');
      return null;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('Error al obtener álbum:', response.status);
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error al obtener información del álbum:', error);
      return null;
    }
  }

  /**
   * Valida si un token de Spotify es válido
   * @param {string} accessToken - Token de acceso de Spotify
   * @returns {Promise<boolean>} - true si el token es válido
   */
  async function validateSpotifyToken(accessToken) {
    if (!accessToken) return false;

    try {
      const response = await fetch('https://api.spotify.com/v1/search?q=test&type=track&limit=1', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.ok;

    } catch (error) {
      console.error('Error al validar token:', error);
      return false;
    }
  }

  /**
   * Formatea la duración de una canción de milisegundos a formato MM:SS
   * @param {number} ms - Duración en milisegundos
   * @returns {string} - Duración formateada (ej: "3:45")
   */
  function formatDuration(ms) {
    if (!ms || typeof ms !== 'number') return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Extrae el año de una fecha de lanzamiento
   * @param {string} releaseDate - Fecha en formato YYYY-MM-DD o YYYY
   * @returns {string|null} - Año o null
   */
  function extractYear(releaseDate) {
    if (!releaseDate) return null;
    return String(releaseDate).slice(0, 4);
  }

  /**
   * Obtiene la mejor imagen de un array de imágenes de Spotify
   * @param {Array} images - Array de imágenes de Spotify
   * @param {string} size - 'small', 'medium', 'large' (default: 'medium')
   * @returns {string|null} - URL de la imagen o null
   */
  function getBestImage(images, size = 'medium') {
    if (!images || !Array.isArray(images) || images.length === 0) return null;

    const sizeMap = {
      small: 2,
      medium: 1,
      large: 0
    };

    const index = sizeMap[size] ?? 1;
    return images[index]?.url || images[0]?.url || null;
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
   * Intenta parsear JSON de forma segura
   * @param {Response} response - Respuesta de fetch
   * @returns {Promise<Object|null>} - Objeto parseado o null
   */
  async function safeJson(response) {
    try {
      return await response.clone().json();
    } catch {
      return null;
    }
  }

  // Exponer API al namespace global
  window.SpotifyAPI = {
    getToken: getSpotifyToken,
    searchTracks: searchSpotifyTracks,
    getTrack: getSpotifyTrack,
    getArtist: getSpotifyArtist,
    getAlbum: getSpotifyAlbum,
    validateToken: validateSpotifyToken,
    formatDuration,
    extractYear,
    getBestImage,
    escapeHtml
  };

  console.log('📡 Spotify API module loaded');

})();
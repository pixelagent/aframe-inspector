export function getUrlFromId(assetId) {
  return (
    assetId.length > 1 &&
    document.querySelector(assetId) &&
    document.querySelector(assetId).getAttribute('src')
  );
}

export function isBlobUrl(url) {
  return typeof url === 'string' && url.startsWith('blob:');
}

/**
 * Convert a blob URL to a data URL that can be used as a regular asset
 * @param {string} blobUrl - The blob URL to convert
 * @returns {Promise<string>} - A data URL representing the blob content
 */
export function blobUrlToDataUrl(blobUrl) {
  return new Promise((resolve, reject) => {
    if (!isBlobUrl(blobUrl)) {
      reject(new Error('Not a blob URL'));
      return;
    }

    fetch(blobUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read blob'));
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * Convert a blob URL to a regular downloadable URL by fetching the blob
 * @param {string} blobUrl - The blob URL to convert
 * @returns {Promise<{url: string, filename: string}>} - Object with URL and suggested filename
 */
export async function blobUrlToDownloadableUrl(blobUrl) {
  if (!isBlobUrl(blobUrl)) {
    throw new Error('Not a blob URL');
  }

  const response = await fetch(blobUrl);
  const blob = await response.blob();

  // Determine filename from blob type
  const mimeType = blob.type;
  let extension = 'bin';
  if (mimeType.startsWith('image/')) {
    extension = mimeType.replace('image/', '') || 'png';
  } else if (mimeType.startsWith('video/')) {
    extension = mimeType.replace('video/', '') || 'mp4';
  } else if (mimeType.startsWith('audio/')) {
    extension = mimeType.replace('audio/', '') || 'mp3';
  }

  const filename = `blob-asset-${Date.now()}.${extension}`;
  const url = URL.createObjectURL(blob);

  return { url, filename };
}

export function getIdFromUrl(url) {
  return document.querySelector("a-assets > [src='" + url + "']")?.id;
}

export function getFilename(url, converted = false) {
  var filename = url.split('/').pop();
  if (converted) {
    filename = getValidId(filename);
  }
  return filename;
}

export function isValidId(id) {
  // The correct re should include : and . but A-frame seems to fail while accessing them
  var re = /^[A-Za-z]+[\w-]*$/;
  return re.test(id);
}

export function getValidId(name) {
  // info.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '')
  return name
    .split('.')
    .shift()
    .replace(/\s/, '-')
    .replace(/^\d+\s*/, '')
    .replace(/[\W]/, '')
    .toLowerCase();
}

export function insertNewAsset(type, id, src, onLoadedCallback = undefined) {
  let element;
  switch (type) {
    case 'img':
      {
        element = document.createElement('img');
        element.id = id;
        element.src = src;
        element.crossOrigin = 'anonymous';
      }
      break;
    case 'video':
      {
        element = document.createElement('video');
        element.id = id;
        element.src = src;
        element.crossOrigin = 'anonymous';
        element.loop = '';
        element.muted = '';
        element.playsinline = '';
      }
      break;
    case 'audio':
      {
        element = document.createElement('audio');
        element.id = id;
        element.src = src;
        element.crossOrigin = 'anonymous';
      }
      break;
    case 'model':
      {
        element = document.createElement('a-asset-item');
        element.id = id;
        element.src = src;
      }
      break;
  }

  if (element) {
    element.onload = function () {
      if (onLoadedCallback) {
        onLoadedCallback();
      }
    };

    let assetsEl = document.querySelector('a-assets');
    if (!assetsEl) {
      assetsEl = document.createElement('a-assets');
      var sceneEl = document.querySelector('a-scene');
      if (!sceneEl) {
        throw new Error('No a-scene element found to append a-assets to');
      }
      sceneEl.appendChild(assetsEl);
    }

    assetsEl.appendChild(element);
  }
}

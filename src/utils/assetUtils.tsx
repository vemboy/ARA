// assetUtils.ts
const DIRECTUS_ASSETS_URL = "https://ara.directus.app/assets";
const DETAULT_IMAGE_ID = "bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48";

export function getImageThumbnailUrl(imageId: string) {
  return `${DIRECTUS_ASSETS_URL}/${imageId}?key=thumbnail`;
}

export function getDefaultImageThumbnailUrl() {
  return getImageThumbnailUrl(DETAULT_IMAGE_ID);
}

export function getImageDetailUrl(imageId: string) {
  return `${DIRECTUS_ASSETS_URL}/${imageId}?key=detail`;
}

export function getDefaultImageDetailUrl() {
  return getImageDetailUrl(DETAULT_IMAGE_ID);
}

export function getPlaceholderRecordImageUrl(): string {
  // SVG representing the placeholder record
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="100" fill="#666"/>
    <circle cx="100" cy="100" r="80" fill="#ddd"/>
    <circle cx="100" cy="100" r="70" fill="#666" stroke="white" stroke-width="2"/>
    <circle cx="100" cy="100" r="20" fill="white"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

// // assetUtils.ts
// const DIRECTUS_ASSETS_URL = "https://ara.directus.app/assets";
// const DEFAULT_IMAGE_ID = "bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48";

// // Example: 600px wide, 80% quality, webp format
// export function getImageThumbnailUrl(imageId: string, width = 600) {
//   return `${DIRECTUS_ASSETS_URL}/${imageId}?width=${width}&quality=80&format=webp`;
// }

// export function getDefaultImageThumbnailUrl() {
//   return getImageThumbnailUrl(DEFAULT_IMAGE_ID);
// }

// // If you want a larger detail version, maybe 1200px wide
// export function getImageDetailUrl(imageId: string, width = 1200) {
//   return `${DIRECTUS_ASSETS_URL}/${imageId}?width=${width}&quality=80&format=webp`;
// }

// export function getDefaultImageDetailUrl() {
//   return getImageDetailUrl(DEFAULT_IMAGE_ID);
// }

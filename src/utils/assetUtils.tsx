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

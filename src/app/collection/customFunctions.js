// Function to generate grid cells
export const generateGridCells = (gridContainer, numGridCells = 50) => {
  if (gridContainer) {
    for (let i = 0; i < numGridCells; i++) {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';

      const circleInner = document.createElement('div');
      circleInner.className = 'circle-inner';
      gridItem.appendChild(circleInner);

      gridContainer.appendChild(gridItem);
    }
  }
};

// Function to apply fit-to-width
export const applyFitToWidth = (araBox, araText, fitToWidthFunction) => {
  if (araBox && araText) {
    const araBoxWidth = araBox.getBoundingClientRect().width;
    console.log('Width of ara-box:', araBoxWidth);

    if (typeof fitToWidthFunction === 'function') {
      try {
        fitToWidthFunction("#ara-text", [
          { method: "font-variation-settings:wdth" },
          "transform"
        ], araBoxWidth);
        console.log('Fit-to-width applied successfully with width:', araBoxWidth);
      } catch (error) {
        console.error('Error applying fit-to-width:', error);
      }
    } else {
      console.error('fitToWidth function is not defined.');
    }
  }
};

// Function to adjust font size on scroll
export const adjustFontSizeOnScroll = (araText, splashPage) => {
  if (araText && splashPage) {
    const splashHeight = splashPage.offsetHeight;
    const scrollY = window.scrollY;
    const scrollPastSplash = Math.max(0, scrollY - splashHeight - 500);
    const newFontSize = Math.max(5, 15 - (scrollPastSplash / 10)); 
    araText.style.fontSize = `${newFontSize}em`;
  }
};

// Function to rotate logo on scroll
export const rotateLogoOnScroll = (splashPage) => {
  if (splashPage) {
    const splashHeight = splashPage.offsetHeight;
    const scrollY = window.scrollY;
    const rotationAngle = Math.min(360, (scrollY / splashHeight) * 500);
    const img = splashPage.querySelector('img');
    if (img) img.style.transform = `rotate(${rotationAngle}deg)`;
  }
};

// Function to initialize the component (e.g., on load)
export const init = (araBox, araText, fitToWidthFunction) => {
  console.log('Initializing...');
  applyFitToWidth(araBox, araText, fitToWidthFunction);
};
        
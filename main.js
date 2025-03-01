import OpenSeadragon from "openseadragon";
import { images } from "./data";

let currentImageIndex = 0;
let viewer;

// Initialize the OpenSeadragon viewer
function initViewer() {
  viewer = OpenSeadragon({
    id: "image-viewer",
    prefixUrl: "/icons/",
    tileSources: {
      type: "image",
      url: images[currentImageIndex].url + "?w=2000&h=2000&fit=max",
      crossOriginPolicy: "Anonymous",
    },
    viewportMargins: { bottom: 120 },
    autoHideControls: false,
    showNavigationControl: true,
    navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
    showNavigator: false,
    showRotationControl: false,
    animationTime: 0.5,
    blendTime: 0.1,
    constrainDuringPan: true,
    maxZoomPixelRatio: 2,
    minZoomLevel: 0.5,
    visibilityRatio: 0.5,
    zoomPerScroll: 1.2,
    showHomeControl: true,
    showZoomControl: true,
    showFullPageControl: true,
  });

  // Create reference strip
  const strip = createReferenceStrip();
  viewer.addControl(strip, {
    anchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT,
  });

  // Add event listeners for custom navigation buttons
  document
    .getElementById("prev-button")
    .addEventListener("click", showPreviousImage);
  document
    .getElementById("next-button")
    .addEventListener("click", showNextImage);

  // Update the selected thumbnail in the reference strip
  updateSelectedThumbnail();

  // Update the width of the reference strip when the viewer is resized
  updateStripContainerWidth();
  viewer.addHandler("full-screen", updateStripContainerWidth);
  viewer.addHandler("resize", updateStripContainerWidth);

  viewer.addHandler("open", function () {
    const zoomInButton = viewer.buttonGroup.buttons[0].element;
    const zoomOutButton = viewer.buttonGroup.buttons[1].element;
    const homeButton = viewer.buttonGroup.buttons[2].element;
    const fullButton = viewer.buttonGroup.buttons[3].element;

    zoomInButton.style.width = "30px";
    zoomInButton.style.height = "30px";
    zoomOutButton.style.width = "30px";
    zoomOutButton.style.height = "30px";
    homeButton.style.width = "30px";
    homeButton.style.height = "30px";
    fullButton.style.width = "30px";
    fullButton.style.height = "30px";
  });
}

function updateStripContainerWidth() {
  const viewerWidth = document.getElementById("image-viewer").offsetWidth;
  document.getElementById("reference-strip-container").style.width =
    viewerWidth + "px";
}

// Create the container and the reference strip with thumbnails
function createReferenceStrip() {
  const stripContainer = document.createElement("div");
  stripContainer.id = "reference-strip-container";

  const referenceStrip = document.createElement("div");
  referenceStrip.id = "reference-strip";
  referenceStrip.innerHTML = "";
  stripContainer.appendChild(referenceStrip);

  images.forEach((image, index) => {
    const thumbDiv = document.createElement("div");
    thumbDiv.className = "reference-thumb";
    thumbDiv.dataset.index = index;

    const img = document.createElement("img");
    img.src = image.thumbnail;
    img.alt = `Thumbnail ${index + 1}`;

    thumbDiv.appendChild(img);
    referenceStrip.appendChild(thumbDiv);

    thumbDiv.addEventListener("click", () => {
      currentImageIndex = index;
      updateViewer();
    });
  });

  return stripContainer;
}

// Update the viewer with the current image
function updateViewer() {
  viewer.open({
    type: "image",
    url: images[currentImageIndex].url + "?w=2000&h=2000&fit=max",
    crossOriginPolicy: "Anonymous",
  });

  updateSelectedThumbnail();
}

// Update the selected thumbnail in the reference strip
function updateSelectedThumbnail() {
  const thumbs = document.querySelectorAll(".reference-thumb");
  thumbs.forEach((thumb) => {
    thumb.classList.remove("selected");
    if (parseInt(thumb.dataset.index) === currentImageIndex) {
      thumb.classList.add("selected");
      // Scroll the thumbnail into view
      thumb.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  });
}

// Show the previous image
function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateViewer();
}

// Show the next image
function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateViewer();
}

// Initialize the viewer when the DOM is loaded
document.addEventListener("DOMContentLoaded", initViewer);

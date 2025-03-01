import OpenSeadragon from "openseadragon";

// Sample images from Unsplash
const images = [
  {
    url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714",
    thumbnail:
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682687218147-9806132dc697",
    thumbnail:
      "https://images.unsplash.com/photo-1682687218147-9806132dc697?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    thumbnail:
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1",
    thumbnail:
      "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682685797661-9e0c87f59c60",
    thumbnail:
      "https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682685797208-c741d58c2eff",
    thumbnail:
      "https://images.unsplash.com/photo-1682685797208-c741d58c2eff?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3",
    thumbnail:
      "https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1740680209886-c461a9c692f3",
    thumbnail:
      "https://images.unsplash.com/photo-1740680209886-c461a9c692f3?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682686578842-00ba49b0a71a",
    thumbnail:
      "https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1682686580186-b55d2a91053c",
    thumbnail:
      "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1485038101637-2d4833df1b35",
    thumbnail:
      "https://images.unsplash.com/photo-1485038101637-2d4833df1b35?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1618915340727-c768b99dc6bb",
    thumbnail:
      "https://images.unsplash.com/photo-1618915340727-c768b99dc6bb?h=200&fit=crop",
  },
  {
    url: "https://images.unsplash.com/photo-1512138664757-360e0aad5132",
    thumbnail:
      "https://images.unsplash.com/photo-1512138664757-360e0aad5132?h=200&fit=crop",
  },
];

let currentImageIndex = 0;
let viewer;

// Initialize the OpenSeadragon viewer
function initViewer() {
  viewer = OpenSeadragon({
    id: "image-viewer",
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    tileSources: {
      type: "image",
      url: images[currentImageIndex].url + "?w=2000&h=2000&fit=max",
      crossOriginPolicy: "Anonymous",
    },
    showNavigationControl: true,
    navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
    showNavigator: false,
    showRotationControl: false,
    animationTime: 0.5,
    blendTime: 0.1,
    constrainDuringPan: true,
    maxZoomPixelRatio: 2,
    minZoomLevel: 0.5,
    // defaultZoomLevel: 0.5,
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
  updateWidth();
  viewer.addHandler("full-screen", updateWidth);
  viewer.addHandler("resize", updateWidth);
}

function updateWidth() {
  var viewerWidth = document.getElementById("image-viewer").offsetWidth;
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

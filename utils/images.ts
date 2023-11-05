function isSpreadPage(img: LoadedImage) {
  if (img.width === 0 || img.height === 0) {
    return false;
  }

  const hThresh = img.height * 0.1;

  return img.width > img.height + hThresh;
}

export function createPairedImages(rootImages: LoadedImage[], pagingMode: "single" | "double" | "double-cover") {
  if (rootImages.length === 0) {
    return [];
  }

  // check if rootImages is a Proxy
  if (pagingMode === "single") {
    return [...rootImages].map((img) => [img]);
  }

  // handle double page
  const paired: LoadedImage[][] = [];
  // clone
  const images = [...rootImages];

  // our double page has two modes, double and double
  // with double we will always make the first page as a single page
  // if not, we will make the first page as a double page

  if (pagingMode === "double") {
    // make the first page as a single page
    paired.push([images[0]]);
    images.shift();
  } else {
    // check for spreads
    if (isSpreadPage(images[0])) {
      // if it is, then we will make it as a single page
      paired.push([images[0]]);
      images.shift();
    } else {
      // if not, then we will make it as a double page
      paired.push([images[0], images[1]]);
      images.shift();
      images.shift();
    }
  }

  // do a while loop until we have no more images
  while (images.length > 0) {
    if (isSpreadPage(images[0])) {
      // if the page is a spread page, then we will make it as a single page
      paired.push([images[0]]);
      images.shift();
    } else {
      // if not, then we will make it as a double page
      paired.push([images[0], images[1]]);
      images.shift();
      images.shift();
    }
  }

  // check if the last pair has a null/undefined value since that means
  // our last pair is a single page
  return paired
    .map((pair) => {
      return pair.filter((img) => img !== undefined);
    })
    .filter((pair) => pair.length > 0);
}

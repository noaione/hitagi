export const useLRRReader = defineStore("lrr.readerDataV2", () => {
  const serverMeta = useServerMeta();
  const config = useLRRReaderConfig();

  // State
  const images = ref<LoadedImage[]>([]);
  const imgPreload = ref<string[]>([]);
  // not a zero-based index
  const currentPage = ref(1);
  const pageIndicator = ref([1]);

  // Getters
  const sortedImages = computed(() => {
    return images.value.sort((a, b) => a.page - b.page);
  });
  const pairedImages = computed(() => {
    return createPairedImages(sortedImages.value, config.pagingMode);
  });
  const nextPage = computed(() => {
    if (pairedImages.value.length === 0) {
      return [1];
    }

    // find the current page, in the paired images
    const pairedImageIndex = pairedImages.value.findIndex(
      (item) => item.findIndex((img) => img.page === currentPage.value) !== -1
    );

    // check if we can navigate to next page
    if (pairedImageIndex !== -1 && pairedImageIndex + 1 < pairedImages.value.length) {
      // get the next page
      const nextPairedImage = pairedImages.value[pairedImageIndex + 1];

      return nextPairedImage.map((img) => img.page);
    }

    // if we can't provide last pair
    return pairedImages.value[pairedImages.value.length - 1].map((img) => img.page);
  });
  const previousPage = computed(() => {
    if (pairedImages.value.length === 0) {
      return [1];
    }

    // same as next page, but in reverse
    const pairedImageIndex = pairedImages.value.findIndex(
      (item) => item.findIndex((img) => img.page === currentPage.value) !== -1
    );

    if (pairedImageIndex !== -1 && pairedImageIndex - 1 >= 0) {
      const previousPairedImage = pairedImages.value[pairedImageIndex - 1];

      return previousPairedImage.map((img) => img.page);
    }

    return pairedImages.value[0].map((img) => img.page);
  });
  const firstPages = computed(() => {
    // get the last image
    const firstPair = pairedImages.value[0];

    // if we have no images, return 1
    if (isNone(firstPair)) {
      return [1];
    }

    // return the page number of the last image
    return firstPair.map((img) => img.page);
  });
  const lastPages = computed(() => {
    // get the last image
    const lastImage = pairedImages.value[pairedImages.value.length - 1];

    // if we have no images, return 1
    if (isNone(lastImage)) {
      return [1];
    }

    // return the page number of the last image
    return lastImage.map((img) => img.page);
  });
  const maxPage = computed(() => {
    return lastPages.value[lastPages.value.length - 1];
  });

  // Actions
  function populate(imageUrls: string[]): void {
    images.value = mapFilesIntoImages(imageUrls);
    console.info("Populated images", images.value);

    pageIndicator.value = config.pagingMode === "double-cover" ? [1, 2] : [1];
  }
  function preload(imageUrl: string): void {
    if (imgPreload.value.includes(imageUrl)) {
      // already preloading
      return;
    }

    const imgIndex = images.value.findIndex((img) => img.url === imageUrl);

    if (imgIndex === -1) {
      // not found
      return;
    }

    if (!isNone(images.value[imgIndex].blob)) {
      // already downloaded
      return;
    }

    imgPreload.value.push(imageUrl);

    const imgElement = new Image();

    imgElement.src = imageUrl.replace(/^.\//, serverMeta.hostURL.origin + "/");
    imgElement.crossOrigin = "anonymous";

    console.info("Preloading image", imgElement.src);
    imgElement.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      ctx.drawImage(imgElement, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }

        console.info("Image preloaded", imgElement.src);
        images.value[imgIndex].blob = blob;
      });
    });
  }
  function updatePageInternal(pages: number[]) {
    switch (config.pagingMode) {
      case "single": {
        pageIndicator.value = [pages[0]];
        currentPage.value = pages[0];
        break;
      }
      default: {
        // set page indicator to the provided page number
        pageIndicator.value = pages;
        // set current page depending on flow
        currentPage.value = config.flow === "ltr" ? pages[0] : pages[pages.length - 1];
        break;
      }
    }
  }
  function updatePage(singleOrDoublePage: number | number[]) {
    if (Array.isArray(singleOrDoublePage)) {
      updatePageInternal(singleOrDoublePage);
    } else {
      if (isNone(pairedImages.value)) {
        // no images loaded yet somehow
        // let's just set it to the provided page
        console.warn("No images loaded yet, setting page to", singleOrDoublePage);
        updatePageInternal([singleOrDoublePage]);

        return;
      }

      const pairedImageIndex = pairedImages.value.findIndex(
        (item) => item.findIndex((img) => img.page === singleOrDoublePage) !== -1
      );

      if (pairedImageIndex !== -1) {
        updatePageInternal(pairedImages.value[pairedImageIndex].map((img) => img.page));
      }
    }
  }
  function preloadImagesFromConfig() {
    nextTick(() => {
      console.info("Preloading images from config", config.preloadCount, currentPage.value);

      const indexPage = currentPage.value - 1;
      const totalPage = images.value.length;
      const maxPage = indexPage + config.preloadCount > totalPage ? totalPage : indexPage + config.preloadCount;
      const minPage = indexPage - config.preloadCount < 0 ? 0 : indexPage - config.preloadCount;

      const preloadFollowings: string[] = [];

      // preload back
      for (let i = indexPage - 1; i >= minPage; i--) {
        preloadFollowings.push(images.value[i].url);
      }

      // preload front
      for (let i = indexPage + 1; i < maxPage; i++) {
        preloadFollowings.push(images.value[i].url);
      }

      // preload current
      preloadFollowings.push(images.value[indexPage].url);

      for (const imgPreload of preloadFollowings) {
        preload(imgPreload);
      }
    });
  }
  function clear(): void {
    images.value = [];
    imgPreload.value = [];

    pageIndicator.value = config.pagingMode === "double-cover" ? [1, 2] : [1];
  }

  return {
    // State
    images,
    imgPreload,
    currentPage,
    pageIndicator,
    // Getters
    sortedImages,
    pairedImages,
    nextPage,
    previousPage,
    firstPages,
    lastPages,
    maxPage,
    // Actions
    populate,
    preload,
    updatePage,
    clear,
    preloadImagesFromConfig,
  };
});

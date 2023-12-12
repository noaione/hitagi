import debounce from "lodash.debounce";

function detectMobile(userAgent: string) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[23]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
      userAgent.slice(0, 4)
    )
  ) {
    return true;
  }

  return false;
}

export const useLRRReader = defineStore("lrr.readerDataV2", () => {
  const serverMeta = useServerMeta();
  const config = useLRRReaderConfig();
  const router = useRouter();
  const { orientation } = useScreenOrientation();

  // State
  const images = ref<LoadedImage[]>([]);
  const imgPreload = ref<string[]>([]);
  const _screenSpyVisible = ref(false);
  const _navigationVisible = ref(false);
  // not a zero-based index
  const currentPage = ref(1);
  const pageIndicator = ref([1]);

  const isLandscape = computed(() => {
    return orientation.value === "landscape-primary" || orientation.value === "landscape-secondary";
  });
  const isMobileDevice = computed(() => {
    return detectMobile(window.navigator.userAgent);
  });

  // Getters
  const screenSpy = computed({
    get: () => _screenSpyVisible.value,
    set: (newValue) => {
      if (newValue) {
        _screenSpyVisible.value = true;

        nextTick(() => {
          setTimeout(() => {
            nextTick(() => {
              _screenSpyVisible.value = false;
            });
          }, 2000);
        });
      } else {
        _screenSpyVisible.value = false;
      }
    },
  });
  const navigationBar = computed({
    get: () => _navigationVisible.value,
    set: (newValue) => {
      _navigationVisible.value = newValue;
    },
  });
  const sortedImages = computed(() => {
    return images.value.sort((a, b) => a.page - b.page);
  });
  const pairedImages = computed(() => {
    // Ensure that we don't use double page mode if we in portrait mode
    if ((config.pagingMode !== "single" && !isLandscape.value && isMobileDevice.value) || config.flow === "webtoon") {
      return createPairedImages(sortedImages.value, "single");
    }

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
    return [];
  });
  const previousPage = computed(() => {
    if (pairedImages.value.length === 0) {
      return [1];
    }

    // same as next page, but in reverse
    const pairedImageIndex = pairedImages.value.findIndex(
      (item) => item.findIndex((img) => img.page === currentPage.value) !== -1
    );

    if (pairedImageIndex === 0) {
      return [];
    }

    if (pairedImageIndex !== -1 && pairedImageIndex - 1 >= 0) {
      const previousPairedImage = pairedImages.value[pairedImageIndex - 1];

      return previousPairedImage.map((img) => img.page);
    }

    return pairedImages.value[0].map((img) => img.page);
  });
  const currentPairIndex = computed({
    get: () => {
      if (pairedImages.value.length === 0) {
        return 0;
      }

      // get from currentPage
      const pairedImageIndex = pairedImages.value.findIndex(
        (item) => item.findIndex((img) => img.page === currentPage.value) !== -1
      );

      if (pairedImageIndex !== -1) {
        return pairedImageIndex;
      }

      return 0;
    },
    set: (value: number) => {
      if (pairedImages.value.length === 0) {
        return;
      }

      // the provided value should be the pairedImages index
      const pairedImage = pairedImages.value[value];

      if (isNone(pairedImage)) {
        return;
      }

      // dispatch updatePage
      updatePage(pairedImage.map((img) => img.page));
    },
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
      images.value[imgIndex].height = imgElement.height;
      images.value[imgIndex].width = imgElement.width;

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
  function updatePageInternalRouter(targetPage: number) {
    currentPage.value = targetPage;

    router.replace({
      query: {
        ...router.currentRoute.value.query,
        page: targetPage.toString(),
      },
    });
  }
  function updatePageInternal(pages: number[]) {
    switch (config.pagingMode) {
      case "single": {
        pageIndicator.value = [pages[0]];
        updatePageInternalRouter(pages[0]);
        break;
      }
      default: {
        // set page indicator to the provided page number
        pageIndicator.value = pages;
        // set current page depending on flow
        updatePageInternalRouter(config.flow === "rtl" ? pages[pages.length - 1] : pages[0]);
        break;
      }
    }

    // load current page
    loadCurrent();
  }
  function updatePage(singleOrDoublePage: number | number[]) {
    if (Array.isArray(singleOrDoublePage)) {
      if (singleOrDoublePage.length === 0) {
        return;
      }

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

      // preload page if preloadPage is set and is not less than or equal to 0
      if (config.preloadPage > 0) {
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
      } else {
        console.warn("Preload page is set to disabled.");
      }

      for (const imgPreload of preloadFollowings) {
        preload(imgPreload);
      }
    });
  }
  function loadCurrent(): void {
    // Do not execute this if we use preloadPage
    if (config.preloadPage > 0) {
      return;
    }

    const indexPage = currentPairIndex.value;

    const indexData = pairedImages.value[indexPage];

    if (isNone(indexData)) {
      return;
    }

    console.info("Loading current page", indexData);

    for (const img of indexData) {
      if (isNone(img.blob)) {
        preload(img.url);
      }
    }
  }
  function clear(): void {
    images.value = [];
    imgPreload.value = [];

    pageIndicator.value = config.pagingMode === "double-cover" ? [1, 2] : [1];
  }

  // Extra
  const pageSelectorIndex = computed({
    get: () => currentPage.value - 1,
    set: (value: number) => {
      updatePage(value + 1);
    },
  });

  return {
    // State
    images,
    imgPreload,
    currentPage,
    pageIndicator,
    _screenSpyVisible,
    // Getters
    sortedImages,
    pairedImages,
    nextPage,
    previousPage,
    currentPairIndex,
    firstPages,
    lastPages,
    maxPage,
    screenSpy,
    navigationBar,
    pageSelectorIndex,
    // Actions
    populate,
    preload,
    updatePage,
    updatePageDebounced: debounce(updatePage, 500),
    clear,
    preloadImagesFromConfig,
    loadCurrent,
  };
});

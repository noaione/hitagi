<template>
  <div :class="`flex flex-col ${bgColor}`">
    <div class="mb-auto block">
      <ReaderNavBar :arc-id="metadata.arcid" pinned @update-page="updatePage" @open-settings="$emit('openModal')" />
    </div>
    <ReaderContainer />
    <div v-if="readerConfig.isPaged" class="mt-auto block">
      <ReaderNavBar
        :arc-id="metadata.arcid"
        pinned
        bottom
        @update-page="updatePage"
        @open-settings="$emit('openModal')"
      />
    </div>
  </div>
  <ReaderHint />
</template>

<script setup lang="ts">
defineProps<{
  metadata: LRRArchiveMetadata;
}>();

const emits = defineEmits<{
  (e: "openModal"): void;
}>();

const router = useRouter();

const reader = useLRRReader();
const readerConfig = useLRRReaderConfig();

const bgColor = computed(() => {
  switch (readerConfig.background) {
    case "black": {
      return "bg-black";
    }
    case "white": {
      return "bg-white";
    }
    default: {
      return "";
    }
  }
});

function updatePage(page: number[]) {
  reader.updatePage(page);

  const selPage = readerConfig.flow === "ltr" ? page[0] : page[page.length - 1];

  router.replace({
    query: {
      page: selPage,
    },
  });
}

function kbdMoveLeft(ctrlKey?: boolean) {
  if (ctrlKey) {
    updatePage(reader.firstPages);
  }

  const movement = reader.previousPage;

  if (movement.length > 0) {
    updatePage(movement);
  }
}

function kbdMoveRight(ctrlKey?: boolean) {
  if (ctrlKey) {
    updatePage(reader.lastPages);
  }

  const movement = reader.nextPage;

  if (movement.length > 0) {
    updatePage(movement);
  }
}

onKeyStroke(["ArrowLeft", "ArrowUp", "A", "W", "a", "w"], (e) => {
  // allow arrow up only in vertical mode
  const verticalMove = e.key === "ArrowUp" || e.key === "W" || e.key === "w";

  if (verticalMove && readerConfig.isPaged) {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveRight(e.ctrlKey);
  } else {
    kbdMoveLeft(e.ctrlKey);
  }
});

onKeyStroke(["ArrowRight", "ArrowDown", "D", "S", "d", "s"], (e) => {
  // allow arrow down only in vertical mode
  const verticalMove = e.key === "ArrowDown" || e.key === "S" || e.key === "s";

  if (verticalMove && readerConfig.isPaged) {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveLeft(e.ctrlKey);
  } else {
    kbdMoveRight(e.ctrlKey);
  }
});

onKeyStroke(["P", "p"], (e) => {
  e.preventDefault();

  const swapchains = ["single", "double", "double-cover"];
  const current = swapchains.indexOf(readerConfig.pagingMode);
  const nextChain = swapchains[(current + 1) % swapchains.length] as "single" | "double" | "double-cover";

  readerConfig.pagingMode = nextChain;
});

onKeyStroke(["R", "r"], (e) => {
  e.preventDefault();

  if (readerConfig.flow === "ltr" || readerConfig.flow === "rtl") {
    readerConfig.flow = readerConfig.flow === "ltr" ? "rtl" : "ltr";
  } else {
    readerConfig.flow = readerConfig.flow === "vertical" ? "webtoon" : "vertical";
  }
});

onKeyStroke(["F", "f"], (e) => {
  e.preventDefault();
  readerConfig.fitMode = readerConfig.fitMode === "screen-height" ? "screen-width" : "screen-height";
});

onKeyStroke(["N", "n"], (e) => {
  e.preventDefault();
  reader.navigationBar = !reader.navigationBar;
});

onKeyStroke(["L", "l"], (e) => {
  e.preventDefault();

  const swapchains = ["gray", "black", "white"];
  const current = swapchains.indexOf(readerConfig.background);
  const nextChain = swapchains[(current + 1) % swapchains.length] as "gray" | "black" | "white";

  readerConfig.background = nextChain;
});

onKeyStroke(["C", "c"], (e) => {
  e.preventDefault();
  emits("openModal");
});

onKeyStroke(["H", "h"], (e) => {
  e.preventDefault();

  readerConfig.firstTimeHint = true;
});
</script>

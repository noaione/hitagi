<template>
  <div :class="`flex flex-col ${bgColor}`">
    <ReaderNavBar :arc-id="metadata.arcid" pinned @open-settings="$emit('openModal')" @open-pages="modalPage = true" />
    <ReaderContainer />
    <ReaderNavBar
      :arc-id="metadata.arcid"
      pinned
      bottom
      @open-settings="$emit('openModal')"
      @open-pages="modalPage = true"
    />
  </div>
  <ModalArchivePageSelector v-model:pair="reader.currentPairIndex" v-model:open="modalPage" />
  <ReaderHint />
</template>

<script setup lang="ts">
defineProps<{
  metadata: LRRArchiveMetadata;
}>();

const emits = defineEmits<{
  (e: "openModal"): void;
}>();

const reader = useLRRReader();
const readerConfig = useLRRReaderConfig();

const modalPage = ref(false);

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

function kbdMoveLeft(ctrlKey?: boolean) {
  if (ctrlKey) {
    reader.updatePage(reader.firstPages);
  }

  const movement = reader.previousPage;

  if (movement.length > 0) {
    reader.updatePage(movement);
  }
}

function kbdMoveRight(ctrlKey?: boolean) {
  if (ctrlKey) {
    reader.updatePage(reader.lastPages);
  }

  const movement = reader.nextPage;

  if (movement.length > 0) {
    reader.updatePage(movement);
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
  if (e.ctrlKey) {
    // CTRL+R -> Reload
    return;
  }

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

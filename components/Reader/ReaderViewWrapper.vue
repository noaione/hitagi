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
</template>

<script setup lang="ts">
defineProps<{
  metadata: LRRArchiveMetadata;
}>();

defineEmits<{
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

  router.replace({
    query: {
      page: page[0],
    },
  });
}

function kbdMoveLeft() {
  const movement = reader.previousPage;

  if (movement[0] !== 1) {
    updatePage(movement);
  }
}

function kbdMoveRight() {
  const movement = reader.nextPage;
  const moveLast = movement[movement.length - 1];
  const maxPairs = reader.pairedImages[reader.pairedImages.length - 1];
  const maxPage = maxPairs[maxPairs.length - 1].page;

  if (moveLast !== maxPage) {
    updatePage(movement);
  }
}

onKeyStroke(["ArrowLeft", "ArrowUp"], (e) => {
  // allow arrow up only in vertical mode
  if (e.key === "ArrowUp" && readerConfig.flow !== "vertical") {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveRight();
  } else {
    kbdMoveLeft();
  }
});

onKeyStroke(["ArrowRight", "ArrowDown"], (e) => {
  // allow arrow down only in vertical mode
  if (e.key === "ArrowDown" && readerConfig.flow !== "vertical") {
    return;
  }

  e.preventDefault();

  if (readerConfig.flow === "rtl") {
    kbdMoveLeft();
  } else {
    kbdMoveRight();
  }
});
</script>

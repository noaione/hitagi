<template>
  <div class="flex flex-col">
    <div class="mb-auto block">
      <ReaderNavBar
        :arc-id="metadata.arcid"
        :page="currentPage"
        :max-page="metadata.pagecount"
        @update-page="updatePage"
        @open-settings="modalReader = true"
      />
    </div>
    <ReaderContainer :arc-id="metadata.arcid" :images="filesMeta.pages" @update-page="updatePage" />
    <div class="mt-auto block">
      <ReaderNavBar
        :arc-id="metadata.arcid"
        :page="currentPage"
        :max-page="metadata.pagecount"
        @update-page="updatePage"
        @open-settings="modalReader = true"
      />
    </div>
  </div>
  <ModalReaderSettings v-model:open="modalReader" />
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const readerConfig = useLRRReaderConfig();

const currentPage = ref(1);
const modalReader = ref(false);

// Use inject/provide to pass updated page number (from nav bar) to reader container
provide(LRRReaderPage, readonly(currentPage));

function updatePage(page: number) {
  console.log("updatePage", page);
  currentPage.value = page;
  // update query without reloading
  router.replace({
    query: {
      page: page,
    },
  });
}

function kbdMoveLeft() {
  if (currentPage.value > 1) {
    updatePage(currentPage.value - 1);
  }
}

function kbdMoveRight() {
  if (currentPage.value < metadata.pagecount) {
    updatePage(currentPage.value + 1);
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

onMounted(() => {
  // fetch and wait
  // then set startPage
  const queryPage = Number(route.query.page);

  if (Number.isNaN(queryPage)) {
    currentPage.value = 1;
  } else {
    if (queryPage < 1) {
      currentPage.value = 1;

      return;
    } else if (queryPage > metadata.pagecount) {
      currentPage.value = metadata.pagecount;

      return;
    }
  }
});

definePageMeta({
  layout: "clean",
});

const metadata = {
  arcid: "a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966",
  extension: "cbz",
  isnew: "false",
  lastreadtime: 0,
  pagecount: 22,
  progress: 0,
  tags: "date_added:1698843110,Ahegao,Anal,Blowjob,Creampie,Doujin,Fingering,Group,Heart Pupils,Hentai,Light Hair,Lingerie,Loli,Squirting,Stockings,Whiteout,X-ray,artist:Chiyami,series:Fate Series,source:https://www.fakku.net/hentai/christmas-present-english-1598389364",
  title: "Christmas Present",
};

const filesMeta = {
  job: 984,
  pages: [
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20001%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20002%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20003%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20004%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20005%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20006%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20007%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20008%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20009%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20010%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20011%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20012%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20013%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20014%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20015%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20016%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20017%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20018%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20019%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20020%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20021%20%28x3200%29%20%5B2D%20Market%5D.png",
    "./api/archives/a4aa7665f30f0c301c5a3fcc5160d9ac7bdf9966/page?path=%5BMukousharan%20%28Chiyami%29%5D%20Christmas%20Present%20-%20022%20%28x3200%29%20%5B2D%20Market%5D.png",
  ],
};
</script>

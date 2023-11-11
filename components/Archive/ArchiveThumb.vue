<template>
  <div v-if="thumbnailUrl !== undefined" :class="`aspect-thumb block justify-center ${$props.class ?? ''}`">
    <NuxtLink v-if="!isNone(props.href)" :to="props.href">
      <img
        :src="thumbnailUrl"
        alt="Thumbnail"
        loading="lazy"
        :class="`h-full rounded-md ${
          settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
        } ${$props.innerClass ?? ''}`"
        crossorigin="anonymous"
      />
    </NuxtLink>
    <img
      v-else
      :src="thumbnailUrl"
      alt="Thumbnail"
      loading="lazy"
      :class="`h-full rounded-md ${thumbFitClass} ${$props.innerClass ?? ''}`"
      crossorigin="anonymous"
    />
  </div>
  <div v-else :class="`aspect-thumb block justify-center ${$props.class ?? ''}`">
    <!-- Fallback to blank div -->
    <NuxtLink v-if="!isNone(props.href)" :to="props.href">
      <div class="h-full rounded-md bg-gray-200 dark:bg-gray-800" />
    </NuxtLink>
    <div v-else class="h-full rounded-md bg-gray-200 dark:bg-gray-800" />
  </div>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  arcId: string;
  page?: number;
  class?: string;
  href?: string;
  innerClass?: string;
  autoRefresh?: boolean;
}>();

const settings = useLRRConfig();
const serverMeta = useServerMeta();

const objectSide = computed(() => {
  switch (settings.thumbSide) {
    case "left": {
      return "object-left";
    }
    case "center": {
      return "object-center";
    }
    case "right": {
      return "object-right";
    }
    default: {
      return "object-right";
    }
  }
});

function makeThumbnailUrl(arcId: string, page?: number) {
  let thumb = `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`;

  if (!isNone(page)) {
    thumb += `?page=${page}`;
  }

  return thumb;
}

const thumbFitClass = clsx(
  settings.thumbFit === "contain" ? "object-contain object-center" : `object-cover ${objectSide.value}`
);

const fallbackUrl = `${serverMeta.hostURL.origin}/img/noThumb.png`;
const thumbnailUrl = ref<string | undefined>(props.autoRefresh ? undefined : makeThumbnailUrl(props.arcId, props.page));

function checkJobStatusUntilDone(jobId: string) {
  useLRR<LRRMinionJob>(`/minion/${jobId}`, {
    method: "GET",
    responseType: "json",
  })
    .then((res) => {
      if (!isNone(res.error)) {
        console.error(res.error);
        thumbnailUrl.value = fallbackUrl;

        return;
      }

      if (res.state === "finished") {
        thumbnailUrl.value = makeThumbnailUrl(props.arcId, props.page);
      } else {
        setTimeout(() => {
          checkJobStatusUntilDone(jobId);
        }, 1000);
      }
    })
    .catch((_error) => {
      console.error(_error);

      thumbnailUrl.value = fallbackUrl;
    });
}

function processJob(resp: Response) {
  resp
    .json()
    .then((data) => {
      checkJobStatusUntilDone(data.job);
    })
    .catch((_error) => {
      console.error(_error);
    });
}

onMounted(() => {
  if (props.autoRefresh) {
    console.info("Using autoRefresh for thumbnail", props.arcId, props.page);

    // do fetch!
    const fetchUrl = new URL(makeThumbnailUrl(props.arcId, props.page));

    // modify params to include no_fallback=true
    fetchUrl.searchParams.set("no_fallback", "true");

    fetch(fetchUrl, {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) {
          thumbnailUrl.value = makeThumbnailUrl(props.arcId, props.page);
        } else if (response.status === 202) {
          console.info("Thumbnail job started", props.arcId, props.page);
          processJob(response);
        } else {
          thumbnailUrl.value = fallbackUrl;
        }
      })
      .catch((_error) => {
        thumbnailUrl.value = fallbackUrl;
        console.error(_error);
      });
  }
});
</script>

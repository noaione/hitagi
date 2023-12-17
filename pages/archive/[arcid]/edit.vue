<template>
  <div v-if="data" class="mt-2 flex w-full flex-col gap-4 md:flex-row">
    <ArchiveThumb :arc-id="String($route.params.arcid)" class="mx-auto h-96 w-64 md:mx-0 md:h-[34rem] md:w-96" />
    <div class="flex flex-col">
      <HitagiInput
        v-model="titleEdit"
        input-id="title"
        container-class="server-width"
        type="text"
        :minlength="1"
        :required="true"
        :disabled="submitting"
      >
        <template #label>
          <label for="title" class="font-semibold text-themed-700 dark:text-themed-300">Title</label>
        </template>
      </HitagiInput>
      <span class="font-sm mt-1 font-light uppercase text-gray-700 dark:text-gray-400">
        <span class="font-bold text-gray-600 dark:text-gray-300">ID</span>:
        <span class="select-all">{{ data.metadata.arcid }}</span>
      </span>
      <div class="mt-2 flex flex-col gap-1">
        <label class="font-semibold text-themed-700 dark:text-themed-300">Tags</label>
        <ArchiveTagsEditor
          v-model:tags="tagsEdit"
          container-class="w-full bg-white dark:bg-gray-800 py-4 px-4 rounded-lg mt-1"
          :disabled="pluginUseLoad || submitting"
        />
      </div>
      <HitagiSelect v-if="loadingPlugins" disabled>
        <template #label>
          <label for="tags-import" class="font-semibold text-themed-700 dark:text-themed-300">Import Tags</label>
        </template>
        <option value="" disabled selected>Loading...</option>
      </HitagiSelect>
      <HitagiSelect v-else v-model="pluginNs" input-id="tags-import" :disabled="pluginUseLoad || submitting">
        <template #label>
          <label for="tags-import" class="font-semibold text-themed-700 dark:text-themed-300">Import Tags</label>
        </template>
        <template #default>
          <option value="" disabled selected>Select a plugin</option>
          <option v-for="plugin in pluginsData" :key="plugin.namespace" :value="plugin.namespace">
            {{ plugin.name }}
          </option>
        </template>
      </HitagiSelect>
      <HitagiInput
        v-if="selectedPlugin?.oneshot_arg"
        v-model="pluginOneshot"
        container-class="mt-2"
        :disabled="pluginUseLoad || submitting"
      >
        <template #label>
          <label
            v-safe-html="selectedPlugin.oneshot_arg"
            for="oneshot-arg"
            class="font-semibold text-themed-700 dark:text-themed-300"
          />
        </template>
      </HitagiInput>
      <HitagiButton
        v-if="selectedPlugin"
        :class="`mt-2 font-semibold ${pluginUseLoad ? 'animate-pulse' : ''}`"
        :disabled="pluginUseLoad || submitting || hasArgsAndEmpty"
        @click="doPluginUse"
      >
        <Icon name="mdi:import" class="mb-0.5" />
        Import Tags
      </HitagiButton>
      <div v-if="selectedPlugin?.oneshot_arg" class="font-sm mt-1 text-gray-600 dark:text-gray-300">
        <Icon name="mdi:information-outline" class="mb-0.5 text-themed-700 dark:text-themed-300" />
        <span class="ml-0.5">
          Using the import tags will replace your tags and title, and the current one will be saved.
        </span>
      </div>

      <div class="flex w-full flex-row gap-2">
        <HitagiButton
          :class="`mt-4 font-semibold ${submitting ? 'animate-pulse' : ''}`"
          :disabled="pluginUseLoad || submitting"
          :href="`/archive/${route.params.arcid}`"
          color="cyan"
          @click="saveCurrent"
        >
          <Icon name="mdi:backburger" class="mb-0.5" />
          Go back
        </HitagiButton>
        <HitagiButton
          :class="`mt-4 font-semibold ${submitting ? 'animate-pulse' : ''}`"
          :disabled="pluginUseLoad || submitting"
          color="green"
          @click="saveCurrent"
        >
          <Icon name="mdi:content-save-edit-outline" class="mb-0.5" />
          Save
        </HitagiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LRRPluginsData } from "~/utils/lrr";

interface PluginUseResponseSimple {
  data: {
    new_tags?: string;
    title?: string;
    error?: string;
  };
}

interface SimpleUpdateResponse {
  operation: string;
  error?: string;
  success: 0 | 1;
}

const toaster = useHitagiToast();
const route = useRoute();
const serverMeta = useServerMeta();

const pluginNs = ref("");
const pluginOneshot = ref("");
const titleEdit = ref<string>("");
const tagsEdit = ref<string[]>([]);
const submitting = ref(false);
const pluginUseLoad = ref(false);

const selectedPlugin = computed(() => {
  if (pluginNs.value === "") return;

  return pluginsData.value?.find((plugin) => plugin.namespace === pluginNs.value);
});
const hasArgsAndEmpty = computed(() => {
  if (!selectedPlugin.value) return false;

  return Boolean(selectedPlugin.value.oneshot_arg && pluginOneshot.value.trim() === "");
});

function setSEO(metadata: LRRArchiveMetadata) {
  const arcId = route.params.arcid;

  useSeoMeta({
    title: metadata.title + " - Edit :: Hitagi",
    ogTitle: metadata.title + " - Edit - Hitagi",
    ogDescription: metadata.tags.split(",").join(", "),
    ogImage: `${serverMeta.hostURL.origin}/api/archives/${arcId}/thumbnail`,
    twitterCard: "summary_large_image",
  });
}

const { data, error } = await useAsyncData(
  `archive-info-${route.params.arcid}`,
  async () => {
    const arcId = route.params.arcid;
    const metadataLRR = useLRR<LRRArchiveMetadata>(`/archives/${arcId}/metadata`);
    const categoriesLRR = useLRR<LRRArchiveCategories>(`/archives/${arcId}/categories`);

    const [metadata, categories] = await Promise.all([metadataLRR, categoriesLRR]);

    setSEO(metadata);

    titleEdit.value = metadata.title;
    tagsEdit.value = metadata.tags.split(",");

    return {
      metadata,
      categories,
    };
  },
  {
    watch: [() => route.params.arcid],
  }
);

if (error.value instanceof Error) {
  // check caused by
  // - FetchError
  if (error.value.cause instanceof FetchError) {
    const errorMsg: string = error.value.cause.response?._data?.error ?? error.value.message;

    if (errorMsg.toLowerCase().includes("this id doesn't")) {
      throw createError({
        statusCode: 404,
        statusMessage: `Archive ${route.params.arcid} not found`,
        data: {
          arcid: String(route.params.arcid),
          from: "archive-edit",
        },
        fatal: true,
      });
    } else {
      toaster.toast({
        title: "Failed to load archive",
        message: errorMsg,
        type: "error",
      });
    }
  } else {
    toaster.toast({
      title: "Unknown error",
      message: "Please see the console for more information.",
      type: "error",
    });
    console.error(error.value);
  }
}

const {
  data: pluginsData,
  pending: loadingPlugins,
  error: errorPlugins,
} = await useAsyncData(`lrr-plugins-metadata`, async () => {
  const pluginsLRR = useLRR<LRRPluginsData[]>(`/plugins/metadata`);
  const plugins = await pluginsLRR;

  return plugins;
});

if (errorPlugins.value instanceof Error) {
  if (errorPlugins.value.cause instanceof FetchError) {
    toaster.toast({
      title: "Failed to load plugins",
      message: errorPlugins.value.cause.response?._data?.error ?? errorPlugins.value.message,
      type: "error",
    });
  } else {
    toaster.toast({
      title: "Unknown error when loading plugins",
      message: errorPlugins.value.message,
      type: "error",
    });
  }
}

async function saveCurrent() {
  if (!data.value) {
    return;
  }

  submitting.value = true;

  try {
    const requested = await useLRR<SimpleUpdateResponse>(`/archives/${data.value.metadata.arcid}/metadata`, {
      method: "PUT",
      query: {
        title: titleEdit.value,
        tags: tagsEdit.value.join(","),
      },
    });

    if (requested.error) {
      toaster.toast({
        title: "Failed to update",
        message: requested.error,
      });
    }
  } catch (error) {
    if (error instanceof FetchError) {
      toaster.toast({
        title: "Failed to update",
        message: error.response?._data?.error ?? error.message,
      });
    } else if (error instanceof Error) {
      toaster.toast({
        title: "Unknown error",
        message: "Please see the console for more information.",
      });
      console.error(error);
    }
  } finally {
    submitting.value = false;
  }
}

async function doPluginUse() {
  if (!selectedPlugin.value) {
    return;
  }

  const queryParams: Record<string, string> = {
    plugin: pluginNs.value,
    id: String(route.params.arcid),
  };

  if (selectedPlugin.value.oneshot_arg) {
    queryParams.arg = pluginOneshot.value;
  }

  pluginUseLoad.value = true;
  await saveCurrent();

  try {
    const requested = await useLRR<PluginUseResponseSimple>("/plugins/use", {
      method: "POST",
      query: queryParams,
    });

    if (requested.data.error) {
      toaster.toast({
        title: "Failed to import tags",
        message: requested.data.error,
        type: "error",
      });
    } else {
      let anyUpdated = false;

      if (requested.data.new_tags) {
        // union
        const mergedTags = new Set([...requested.data.new_tags.split(","), ...tagsEdit.value]);

        tagsEdit.value = [...mergedTags];
        anyUpdated = true;
      }

      if (requested.data.title) {
        titleEdit.value = requested.data.title;
        anyUpdated = true;
      }

      pluginOneshot.value = "";

      if (anyUpdated) {
        toaster.toast({
          title: "Imported tags",
          message: "New tags and title have been imported.",
          type: "success",
        });
      }
    }
  } catch (error) {
    if (error instanceof FetchError) {
      toaster.toast({
        title: "Failed to import tags",
        message: error.response?._data?.error ?? error.message,
        type: "error",
      });
    } else if (error instanceof Error) {
      toaster.toast({
        title: "Unknown error",
        message: "Please see the console for more information.",
        type: "error",
      });
      console.error(error);
    }
  } finally {
    pluginUseLoad.value = false;
  }
}

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped lang="postcss">
.server-width {
  @apply w-[90%] md:w-[60%] lg:w-[30%];
}
</style>

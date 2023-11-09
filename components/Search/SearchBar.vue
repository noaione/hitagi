<template>
  <div ref="refEl" :class="`flex w-full flex-row ${$props.class}`">
    <HitagiInput v-model="searchQuery" container-class="w-full" placeholder="Search..." />
    <HitagiIconButton name="heroicons:magnifying-glass" class="w-full pl-2 pr-1" @click="doSearch" />
  </div>
  <Teleport to="body">
    <Transition name="tooltip-suggestions">
      <div
        v-if="searchSuggestions.length > 0"
        ref="floatEl"
        class="z-30 w-full rounded-md bg-gray-300 !bg-opacity-50 backdrop-blur-lg dark:bg-gray-700"
        :style="[floatingStyles, { maxWidth: `${refEl?.offsetWidth}px` }]"
        data-suggestions="1"
      >
        <div class="flex flex-col gap-2 px-1 py-2">
          <button
            v-for="suggestion in searchSuggestions"
            :key="`${suggestion.namespace}:${suggestion.text}`"
            class="text-sm transition-opacity hover:opacity-75"
            @click="[onClickSuggestion(suggestion)]"
          >
            {{ formatSuggestion(suggestion) }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { offset, shift } from "@floating-ui/vue";

const props = defineProps<{
  class?: string;
  initialQuery?: string;
}>();

const floatEl = ref();
const refEl = ref<HTMLDivElement>();

const searchState = useLRRSearch();
const searchQuery = ref("");
const searchSuggestions = ref<LRRDatabaseStatsItemWithMatch[]>([]);

const { floatingStyles } = useFloating(refEl, floatEl, {
  middleware: [offset(10), shift()],
  placement: "bottom-start",
});

function formatSuggestion(data: LRRDatabaseStatsItemWithMatch) {
  if (data.namespace) {
    return `${data.namespace}:${data.text}`;
  }

  return data.text;
}

function onClickSuggestion(data: LRRDatabaseStatsItemWithMatch) {
  // current query
  const query = searchQuery.value;

  // check last comma
  const lastComma = query.lastIndexOf(",");

  // append suggestion like this:
  // "previous query[lastcomma] suggestion"
  const newSuggest = formatSuggestion(data);

  // if no comma, append suggestion
  if (lastComma === -1) {
    searchQuery.value = `${newSuggest}$, `;
  } else {
    const preQuery = query.slice(0, Math.max(0, lastComma + 1));

    // if suggestion already exists, remove it
    if (!preQuery.includes(newSuggest)) {
      searchQuery.value = `${preQuery} ${newSuggest}$, `;
    }
  }
}

function postProcessSuggestion(suggestions: LRRDatabaseStatsItemWithMatch[]) {
  // check if each suggestion is already in the query

  const query = searchQuery.value;

  return suggestions.filter((suggest) => {
    const splitComma = query.split(",");

    // check if suggestion is already in query
    for (const split of splitComma) {
      if (split.trim().includes(formatSuggestion(suggest))) {
        return false;
      }
    }

    return true;
  });
}

function doSearch() {
  searchState.filter = searchQuery.value;
  searchState.search(0, true);
}

watchDebounced(
  () => searchQuery.value,
  (newValue) => {
    if (newValue.length > 0) {
      const lastComma = newValue.lastIndexOf(",");

      if (lastComma === -1) {
        // search all
        searchSuggestions.value = postProcessSuggestion(createSuggestions(newValue, 10));
      } else {
        // start after last comma
        const query = newValue.slice(lastComma + 1);

        searchSuggestions.value = postProcessSuggestion(createSuggestions(query, 10));
      }
    }
  },
  { debounce: 300 }
);

watch(
  () => props.initialQuery,
  (newValue) => {
    if (newValue) {
      searchQuery.value = newValue;
    }
  }
);

onMounted(() => {
  if (props.initialQuery) {
    searchQuery.value = props.initialQuery;
  }
});
</script>

<style scoped lang="postcss">
.tooltip-suggestions-enter-active,
.tooltip-suggestions-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-suggestions-enter-from,
.tooltip-suggestions-leave-to {
  opacity: 0;
}
</style>

<template>
  <main
    class="font-dm-sans mx-auto"
    :class="{
      'flex h-full min-h-screen flex-col py-2 md:py-4 lg:py-8': layout === 'default',
      'my-auto': layout === 'clean',
    }"
  >
    <AppHeader v-if="layout === 'default'" />
    <div
      class="flex min-h-screen flex-col items-center"
      :class="{
        'mx-2 md:mx-4 lg:mx-8': layout === 'default',
      }"
    >
      <div class="mt-2 text-center text-xl font-semibold">An error occured ({{ error.statusCode }})</div>
      <div v-if="error.message" class="mt-2">{{ error.message }}</div>
      <div v-if="error.description" class="mt-2">{{ error.description }}</div>

      <div class="mt-4 flex w-fit flex-row justify-center text-center">
        <HitagiButton @click="router.back()">Go back</HitagiButton>
      </div>
    </div>
    <AppFooter v-if="layout === 'default'" />
  </main>
</template>

<script setup lang="ts">
interface NuxtErrorProps {
  url: string;
  statusCode: number;
  statusMessage: string;
  message: string;
  description: string;
  data?: any;
}

interface ArchiveErrorData {
  arcid: string;
  from: string;
  layout: string;
}

const props = defineProps<{
  error: NuxtErrorProps & { data?: ArchiveErrorData };
}>();

const router = useRouter();

const layout = computed(() => {
  const layoutProps = props.error.data?.layout ?? "";

  if (layoutProps !== "") {
    return layoutProps;
  }

  // if login.vue or server.vue, use clean
  const fromPage = props.error.data?.from ?? "";

  if (fromPage === "login" || fromPage === "server") {
    return "clean";
  }

  return "default";
});
</script>

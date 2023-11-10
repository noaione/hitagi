<template>
  <div class="container mx-auto my-4 flex flex-col items-center justify-between md:flex-row md:items-start">
    <SettingsAbout />
    <hr class="mb-2 mt-5 block h-2 w-full border-hitagi-600 dark:border-hitagi-300 md:hidden" />
    <div class="flex w-full flex-col gap-2">
      <SettingsNavigation name="General" href="/settings/general" />
      <SettingsNavigation name="Reader" href="/settings/reader" />
      <SettingsNavigation name="Server Configuration" :href="serverLink" />
      <SettingsNavigation name="Plugins Configuration" :href="pluginLink" />
      <SettingsNavigation name="Database Backup" :href="dbBackup" />
    </div>
  </div>
</template>

<script setup lang="ts">
const serverMeta = useServerMeta();

const serverLink = computed(() => {
  return `${serverMeta.hostURL.origin}/config`;
});

const pluginLink = computed(() => {
  return `${serverMeta.hostURL.origin}/config/plugins`;
});

const dbBackup = computed(() => {
  return `${serverMeta.hostURL.origin}/backup`;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="mb-4 flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>Thumbnail Fit</label>
        <select v-model="settings.thumbFit" class="form-select rounded-md dark:bg-hitagi-950">
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
        </select>
      </div>
    </div>
    <div class="flex flex-row flex-wrap gap-2">
      <LinkablePill color="hitagi">Hitagi</LinkablePill>
      <LinkablePill color="gray">Gray</LinkablePill>
      <LinkablePill color="red">Red</LinkablePill>
      <LinkablePill color="yellow">Yellow</LinkablePill>
      <LinkablePill color="green">Green</LinkablePill>
      <LinkablePill color="blue">Blue</LinkablePill>
      <LinkablePill color="indigo">Indigo</LinkablePill>
      <LinkablePill color="purple">Purple</LinkablePill>
      <LinkablePill color="pink">Pink</LinkablePill>
      <LinkablePill color="orange">Orange</LinkablePill>
      <LinkablePill color="cyan">Cyan</LinkablePill>
      <LinkablePill color="emerald">Emerald</LinkablePill>
    </div>
    <div class="flex flex-row flex-wrap gap-2">
      <LinkablePill color="hitagi" outlined>Hitagi</LinkablePill>
      <LinkablePill color="gray" outlined>Gray</LinkablePill>
      <LinkablePill color="red" outlined>Red</LinkablePill>
      <LinkablePill color="yellow" outlined>Yellow</LinkablePill>
      <LinkablePill color="green" outlined>Green</LinkablePill>
      <LinkablePill color="blue" outlined>Blue</LinkablePill>
      <LinkablePill color="indigo" outlined>Indigo</LinkablePill>
      <LinkablePill color="purple" outlined>Purple</LinkablePill>
      <LinkablePill color="pink" outlined>Pink</LinkablePill>
      <LinkablePill color="orange" outlined>Orange</LinkablePill>
      <LinkablePill color="cyan" outlined>Cyan</LinkablePill>
      <LinkablePill color="emerald" outlined>Emerald</LinkablePill>
    </div>
    <ArchiveListInfo :data="testData" />
    <ArchiveListInfo :data="testData" compact />
    <div class="flex flex-row gap-2">
      <ArchiveGridInfo :data="testData" />
      <ArchiveGridInfo :data="testData" />
    </div>
  </div>
</template>

<script setup lang="ts">
const testData: LRRArchiveMetadata = {
  arcid: "531b9815f29e7a2ea1d893da10880ea20136b4a6",
  isnew: "false",
  lastreadtime: 0,
  pagecount: 6,
  progress: 0,
  tags: "date_added:1698846435,Busty,Color,Ecchi,Illustration,Swimsuit,Tanlines,Unlimited,artist:Michiking,series:Original Work,magazine:Comic Kairakuten 2021-09,source:https://www.fakku.net/hentai/kairakuten-cover-girl-2021-09-michiking-english",
  title: "Kairakuten Cover Girl 2021-09: Michiking",
};

const settings = useLRRConfig();
</script>

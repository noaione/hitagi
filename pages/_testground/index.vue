<template>
  <div class="flex flex-col gap-2">
    <HitagiInput v-model="disabledForm" type="checkbox" container-class="gap-2" swap>
      <template #label>Disable form?</template>
    </HitagiInput>
    <HitagiInput container-class="w-full" :disabled="disabledForm">
      <template #label>Testing</template>
    </HitagiInput>
    <div class="mb-4 flex flex-col gap-2">
      <HitagiSelect v-model="settings.thumbFit" :disabled="disabledForm">
        <option value="contain">Contain</option>
        <option value="cover">Cover</option>

        <template #label><label>Thumbnail Fit</label></template>
      </HitagiSelect>
    </div>
    <HitagiRadioContainer class="gap-2">
      <template #label>
        <span>Radio block outline</span>
      </template>
      <HitagiRadioBlock
        v-for="radioData in radioOptions"
        :key="radioData.value"
        v-model="selectedRadio"
        class="rounded"
        :value="radioData.value"
        :disabled="disabledForm"
      >
        <div class="block px-2 py-2">
          <div class="w-full text-lg font-semibold">{{ radioData.name }}</div>
          <div class="flex flex-wrap">{{ radioData.description }}</div>
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="gap-2">
      <template #label>
        <span>Radio block filled</span>
      </template>
      <HitagiRadioBlock
        v-for="radioData in radioOptions"
        :key="radioData.value"
        v-model="selectedRadio"
        class="rounded"
        :value="radioData.value"
        :disabled="disabledForm"
        filled
      >
        <div class="block px-2 py-2">
          <div class="w-full text-lg font-semibold">{{ radioData.name }}</div>
          <div class="flex flex-wrap">{{ radioData.description }}</div>
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="mb-2 font-semibold text-themed-700 dark:text-themed-300">Theme</span>
      </template>
      <HitagiRadioBlock
        v-for="kvKey in HitagiTheme"
        :key="kvKey"
        v-model="hitagiTheme"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ capitalize(kvKey) }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
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

const disabledForm = ref(false);

const selectedRadio = ref();
const radioOptions = [
  {
    name: "Option 1",
    value: "option1",
    description: "This is option 1",
  },
  {
    name: "Option 2",
    value: "option2",
    description: "This is option 2",
  },
];

const HitagiTheme = ["hitagi", "hachikuji", "shinobu"];
const hitagiTheme = useLRRTheme();

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

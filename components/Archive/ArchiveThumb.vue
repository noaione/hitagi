<template>
  <div :class="`aspect-thumb block justify-center ${$props.class ?? ''}`">
    <NuxtLink v-if="!isNone(props.href)" :to="props.href">
      <img
        :src="thumbnail"
        alt="Thumbnail"
        loading="lazy"
        :class="`h-full rounded-md ${
          settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
        } ${$props.innerClass ?? ''}`"
        crossorigin="anonymous"
        @load="handleAutoRefreshWhenNoThumbnail"
      />
    </NuxtLink>
    <img
      v-else
      :src="thumbnail"
      alt="Thumbnail"
      loading="lazy"
      :class="`h-full rounded-md ${thumbFitClass} ${$props.innerClass ?? ''}`"
      crossorigin="anonymous"
      @load="handleAutoRefreshWhenNoThumbnail"
    />
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

const thumbFitClass = clsx(
  settings.thumbFit === "contain" ? "object-contain object-center" : `object-cover ${objectSide.value}`
);

const LRRNoThumbnailB64 =
  "OSke/zwqIP89Kx//PSwf/z0tIP88LRz/PCwf/z4tIf89LSL/PCwf/zwrHv89LB//PSwf/zwrH/86Kx7/Oisc/zorG/88Kxz/PCsf/z0sIv89LCT/PS0k/z0tIv88LCH/PCwh/zwtIf86LB//Oise/zorHv88LR//PDAf/zwwIv89LSP/PC0h/z0tIP8+LiD/PS0f/zwrIP89LCH/PS0j/z4uI/88Kx//OSse/zorHv86Kxz/Oika/zooGf85KRn/OSkZ/zkoGf88KRn/PCka/zgpGf85KRr/Oikb/zwrG/86LBv/Oiwb/zwsGv89LBr/PC0a/zwsGf86Khn/Oiob/zkpG/86KBv/PCkb/z0pHP88KRv/OigZ/zooGf88KRr/Oioa/zoqG/88Kxz/PCse/zwsHv89LB7/PSwf/z4tIP8+LB//PS0f/z0sH/88Kx//PCoe/zwqHP88KRz/PCke/z0qHv89Kh7/PCsc/z0tHv89LR7/PS4e/z0uHP89LR7/PC0c/zwsHP86Kxz/OSkc/zkpG/85Khz/PCoe/zorHP85Kxv/OCoZ/zkqG/84Khv/Niga/zUnGf81Jxv/NSUe/zYnHv84Jx7/OCgb/zkpGv86Khn/PCsZ/zorGv86Kxv/Oikb/zopGv86Khz/PSsf/z0sIf89LCD/PCwf/zoqHv86Kx//Oiwg/zwrHv86KRz/OSkZ/zkpGf85Khr/OSsa/zorG/86KRz/PCkb/zwpGv88Khr/PCoa/zopGv84KBj/OCgY/zopGf86KBj/OCUX/zkoGP85KRn/OisY/zoqGP86Kxr/PCsc/zwsG/88LBz/PSwe/z0tH/89LCD/Oisc/zgpG/86KRn/PCka/zwpG/88Khz/PCob/zopGP84KBf/OSgY/zwpG/86KR7/Oike/zkqHP86Kxv/Oioa/zopGf86KBn/OigZ/zopGv84KRr/OCcY/zonGf86KRr/PCob/zwqHP86Kh7/Oiof/zwsIP86LBz/Oisb/zksG/86LBv/PCwb/zwtG/88LRr/OisZ/zkrGf85Khr/OSoa/zkqGv84Khr/OSoa/zkpGv85KiH/Oiog/z0sIP89LSD/PS4i/z4uIf8+LSH/Pi4h/z4uIv8+LiH/Pi4i/z4uIv89LSD/PS0h/z0tIP89LCL/PS0i/z0tIv8+LSL/Py4l/z8uKP8+LiX/Pi0k/z4uI/8+LST/PC4j/z0tI/89LSL/PS0j/z4uI/8+MCP/PjAn/z4wJ/8/Lif/PS4g/z0wIP89LiH/Pi0i/z8uJf8/MCf/Py4n/z4tJP89LCP/PS0i/z4tIv8+LCD/Piwf/zwsH/88LB//PCsc/zwrHP86Kxz/OSsb/zwsHv89LR//Pi0g/zwtHv88Lh7/PTAe/z4uHP8+Lhz/PS4b/z0tHP88LR//Oise/zwqHv89Kx7/PSsf/zwrHv86Khv/Oisb/zorH/86LRz/PC0e/z0tHv89LB7/PCwe/z0sHv89LR//Pi4f/z4tIP8+LSH/Pi0i/zwuIf88LSD/PC0f/zwrIf89LCH/PS0g/z0sHv88LBz/PC0e/zotHv8+Lh//Pi4f/z4tH/8+LR//Pi0g/z0sIP88LB//PCsg/zosIP89LCP/PSwh/zwsIP88LB7/PC0e/z0tH/86LB7/Oiwe/zksH/85KyD/Oisg/zoqIf85Kh7/OSoe/zorHP88LBz/Oiwe/zorHv86Kh//Oiwe/zosHv88LR//PS0g/z0tIP89LSD/PCwg/z0tIP8+LSH/PSsf/z0qHv88Khv/PSoc/z0sHP88LR7/Oiwe/zoqHv88KRz/PCob/z0rHv89Kxz/Pise/zorG/86KRv/PSkb/zwoGv85Jxj/Oiob/zwrHP88LBr/PCoa/z0sHP8+LSD/PS0h/z0sIv89LSL/PS0h/z0sIf88Kx//Oioc/zoqGv86Khz/Oise/zosH/88Kx7/Oioa/zkqGv86Khr/PSoe/zwqHv86Kh//OSse/zorHP88LBz/Oiwc/zorHP86LBz/Oiwe/zkrG/86Khr/PCsb/zwtHP88LR7/PSwg/z0sIf89LCH/PS0h/zwsH/86LB7/Oiwb/zwsHP88LBz/PS0e/z0tHv88LB//PCwf/zwsHv86Kxz/OSsb/zorG/86Khv/Oiob/z0sI/8/LCH/Pi0g/z4tIP8/MCL/Py4i/z4uI/8+LiL/Py4j/z4wIv8+MCH/PjAi/z4wIf8/LiL/Py4l/z8uKP8+Lij/Pi4n/z4wJ/8/MCf/PzAn/z8uJ/8/LiX/Py4l/z4uJ/89LiX/PC4l/z0wI/8+LiP/Pi4j/z8uJP8/MCj/QDAp/z8uJ/8+LiL/PjAh/z8wIf8/MCP/PzAn/0AxKf9AMCj/Py4o/z4uKP8/LiX/Pi4k/z8uIv8/LiL/PS4h/z0uIf89LSD/Pi0f/z0sH/89LR//PS4g/z8uIf8/LiH/Py4h/z4wIP8+MCD/Py4g/z8uIP8/MCD/Py0g/zwtH/88LB7/PSwf/z8tIP89LSD/PC0f/zwtH/88LR//PS0h/z4uIP89LiD/PS4g/z0tH/88LSD/PS0g/z0uIf8+MCL/Pi4i/z8uJf9ALij/Pi4n/z4uI/8/LiP/Pi4j/z8wJP8+LiL/PS0f/z0tH/89Lh//PS0f/z4wIP8/MCD/Pi4h/z4uIf8+LiH/Pi4j/z4wJf8+LiX/PS0k/z4uJf8+LiP/Pi4h/z4uIP8=";

const thumbnail = computed(() => {
  let thumb = `${serverMeta.hostURL.origin}/api/archives/${props.arcId}/thumbnail`;

  if (!isNone(props.page)) {
    thumb += `?page=${props.page}`;
  }

  return thumb;
});

function handleAutoRefreshWhenNoThumbnail(ev: Event) {
  if (!props.autoRefresh) return;

  const img = ev.target as HTMLImageElement;

  // get the image data since we want to check if the image is the not found image send
  // by server when requesting thumbnail for a page that are not cached yet.

  const canvas = document.createElement("canvas");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (isNone(ctx)) return;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // open buffer, get the first 2k bytes
  const buffer = new Uint8Array(imageData.data.buffer, 0, 2048);
  // convert to base64
  const networkb64 = btoa(String.fromCodePoint(...buffer));

  // check if the base64 is the same as the not found image
  if (LRRNoThumbnailB64 === networkb64) {
    // if it is, force reload the image after 500ms
    console.warn("No thumbnail found, forcing reload");

    setTimeout(() => {
      const ttl = new Date();
      const parsedUrl = new URL(img.src);

      parsedUrl.searchParams.set("rrrg", String(ttl.getTime()));

      img.src = parsedUrl.toString();
    }, 500);
  }
}
</script>

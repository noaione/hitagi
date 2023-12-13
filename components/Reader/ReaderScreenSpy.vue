<template>
  <Teleport to="body">
    <Transition name="sspy-fade">
      <div v-show="reader.screenSpy" class="fixed left-0 top-0 h-screen w-screen" data-screen-spy="1">
        <ReaderScreenSpyPaged v-if="readerConf.isPaged" />
        <ReaderScreenSpyVertical v-else />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * The purpose of this component is to capture mouse and touch events
 * for the whole window.
 *
 * The window are split into the following area:
 * |---------------------|
 * |       |     |       |
 * |       |     |       |
 * |       |     |       |
 * |   L   |  M  |   R   |
 * |       |     |       |
 * |       |     |       |
 * |       |     |       |
 * |---------------------|
 *
 * Left/right part takes 35% of the screen width
 * Middle takes 30% of the screen width
 *
 * When clicking left/right, do the navigation update for the reader
 * Clicking middle will activate the navigation bar.
 *
 * Reference for vertical mode:
 * |---------------------|
 * |                     |
 * |          L          |
 * |                     |
 * |---------------------|
 * |          M          |
 * |---------------------|
 * |                     |
 * |          R          |
 * |                     |
 * |---------------------|
 */

const props = defineProps<{
  reference?: HTMLDivElement;
}>();

const mouseTrap = ref<() => void>();
const touchTrap = ref<() => void>();
const reader = useLRRReader();
const readerConf = useLRRReaderConfig();

function getTargetWidth(target: EventTarget) {
  if (target === window) {
    return window.innerWidth;
  }

  return (target as HTMLDivElement).offsetWidth;
}

function trapHandlePaged(x: number, target: EventTarget) {
  const baseW = getTargetWidth(target);
  const left = x < baseW * 0.35;
  const right = x > baseW * 0.65;
  const middle = !left && !right;

  if (left) {
    // go to previous page
    if (readerConf.flow === "ltr") {
      reader.updatePage(reader.previousPage);
    } else {
      reader.updatePage(reader.nextPage);
    }
  } else if (right) {
    // go to next page
    if (readerConf.flow === "ltr") {
      reader.updatePage(reader.nextPage);
    } else {
      reader.updatePage(reader.previousPage);
    }
  } else if (middle) {
    reader.navigationBar = !reader.navigationBar;
  }
}

function trapHandleVertical(y: number) {
  const baseH = window.innerHeight;

  const top = y < baseH * 0.35;
  const bottom = y > baseH * 0.65;
  const middle = !top && !bottom;

  if (top) {
    // go to previous page
    reader.updatePage(reader.previousPage);
  } else if (bottom) {
    // go to next page
    reader.updatePage(reader.nextPage);
  } else if (middle) {
    reader.navigationBar = !reader.navigationBar;
  }
}

function trapHandle(params: { x: number; y: number }, target: EventTarget) {
  if (readerConf.isPaged) {
    trapHandlePaged(params.x, target);
  } else {
    trapHandleVertical(params.y);
  }
}

function handleMouseTrapArea(ev: MouseEvent) {
  // only handle left click
  if (ev.button !== 0) return;

  const { clientX, clientY, currentTarget } = ev;

  trapHandle({ x: clientX, y: clientY }, currentTarget ?? window);
}

function handleTouchTrapArea(ev: TouchEvent) {
  if (ev.targetTouches.length === 0) {
    return;
  }

  // check if the event is a touch event
  const { clientX, clientY } = ev.targetTouches[0];

  trapHandle({ x: clientX, y: clientY }, ev.currentTarget ?? window);
}

function addTrapListener(reference: HTMLDivElement | Window) {
  touchTrap.value?.();
  mouseTrap.value?.();

  touchTrap.value = useEventListener(reference, "mouseup", handleMouseTrapArea, {
    passive: true,
    capture: false,
  });
  mouseTrap.value = useEventListener(props.reference ?? window, "touchend", handleTouchTrapArea, {
    passive: true,
    capture: false,
  });
}

// Trap for window size change
const { width: windowWidthSize } = useWindowSize();

watch(
  () => windowWidthSize.value,
  () => {
    reader.screenSpy = true;

    addTrapListener(props.reference ?? window);
  }
);

watch(
  () => readerConf.isPaged,
  () => {
    reader.screenSpy = true;

    addTrapListener(props.reference ?? window);
  }
);

watch(
  () => props.reference,
  (newRef) => {
    if (newRef) {
      addTrapListener(newRef);
    }
  }
);

onMounted(() => {
  addTrapListener(props.reference ?? window);
});
</script>

<style scoped lang="postcss">
.sspy-fade-enter-active,
.sspy-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sspy-fade-enter-from,
.sspy-fade-leave-to {
  opacity: 0;
}

.sspy-next-bg {
  @apply bg-green-500;
}
.sspy-prev-bg {
  @apply bg-red-500;
}
</style>

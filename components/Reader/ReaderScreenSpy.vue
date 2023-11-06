<template>
  <Teleport to="body">
    <Transition name="sspy-fade">
      <div v-show="reader.screenSpy" class="fixed left-0 top-0 w-screen" data-screen-spy="1">
        <div class="absolute left-0 top-0 h-screen w-[35%] bg-red-500 bg-opacity-50 backdrop-blur-md">
          <div class="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform-gpu">
            <div class="text-2xl font-bold text-white">
              <p class="select-none uppercase shadow-md drop-shadow-md">
                {{ readerConf.flow === "ltr" ? "Left" : "Right" }}
              </p>
            </div>
          </div>
        </div>
        <div class="absolute left-[65%] top-0 h-screen w-[35%] bg-green-500 bg-opacity-50 backdrop-blur-md">
          <div class="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform-gpu">
            <div class="text-2xl font-bold text-white">
              <p class="select-none uppercase drop-shadow-md">
                {{ readerConf.flow === "ltr" ? "Right" : "Left" }}
              </p>
            </div>
          </div>
        </div>
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

function trapHandle({ x }: { x: number }, target: EventTarget) {
  const baseW = getTargetWidth(target);
  const left = x < baseW * 0.35;
  const right = x > baseW * 0.65;
  const middle = !left && !right;

  console.log(left, right, middle, baseW, x, target);

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

function handleMouseTrapArea(ev: MouseEvent) {
  // only handle left click
  if (ev.button !== 0) return;

  const { clientX, currentTarget } = ev;

  trapHandle({ x: clientX }, currentTarget ?? window);
}

function handleTouchTrapArea(ev: TouchEvent) {
  // check if the event is a touch event
  const { clientX } = ev.touches[0];

  trapHandle({ x: clientX }, ev.currentTarget ?? window);
}

function addTrapListener(reference: HTMLDivElement | Window) {
  console.log("Adding trap listener", reference, touchTrap, mouseTrap);
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
</style>

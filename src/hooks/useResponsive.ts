import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

export const xs = computed(() => width.value <= 640);
export const sm = computed(() => width.value <= 768);
export const md = computed(() => width.value <= 992);
export const lg = computed(() => width.value <= 1200);
export const xl = computed(() => width.value <= 1920);
export const xxl = computed(() => width.value <= 2560);

export const isPhone = sm;


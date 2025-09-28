<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <div :key="$route.name">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>

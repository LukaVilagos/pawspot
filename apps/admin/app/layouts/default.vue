<template>
  <UDashboardGroup>
    <SideBar />
    <UContainer class="py-4 max-w-[2000px] overflow-y-auto scroll-smooth">
      <Breadcrumbs />
      <slot />
    </UContainer>
  </UDashboardGroup>
</template>

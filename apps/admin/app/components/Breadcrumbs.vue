<template>
    <UBreadcrumb :items="items" separator-icon="i-lucide-chevron-right" />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<BreadcrumbItem[]>(() => {
    const segments = route.path.split('/').filter(Boolean)
    const crumbs: BreadcrumbItem[] = []
    let acc = ''

    segments.forEach((seg, idx) => {
        acc += '/' + seg
        const label = decodeURIComponent(seg)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())

        crumbs.push({
            label,
            to: idx < segments.length - 1 ? acc : undefined,
            icon: idx === 0 ? 'i-lucide-home' : undefined,
        })
    })

    if (crumbs.length === 0) {
        crumbs.push({ label: 'Dashboard', to: '/', icon: 'i-lucide-home' })
    }

    return crumbs
})
</script>

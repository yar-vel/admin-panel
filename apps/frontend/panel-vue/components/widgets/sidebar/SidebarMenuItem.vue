<script setup lang="ts">
const props = defineProps<{
  title?: string
  href?: string
  icon?: string
  childs?: IMenuItem<string>[]
}>()

const route = useRoute()
const router = useRouter()
const selected = ref(false)

watch(
  () => route.path,
  () => {
    let result = Boolean(props.href)
    const pathArr = route.path.split('/')
    const linkArr = props.href?.split('/') || []
    linkArr.forEach((value, index) => {
      if (value !== pathArr[index]) {
        result = false
      }
    })
    selected.value = result
  },
  { immediate: true },
)
</script>

<template>
  <v-list-group
    v-if="childs?.length"
    :fluid="true"
    :value="`${title}: ${href}`"
  >
    <template #activator="{ props: itemProps }">
      <v-list-item
        v-bind="itemProps"
        :prepend-icon="icon"
        :title="title"
      />
    </template>
    <v-divider />
    <SidebarMenuItem
      v-for="child of childs"
      :key="`sbmi:${child.title}:${child.href}`"
      v-bind="child"
    />
  </v-list-group>
  <v-list-item
    v-else
    :active="selected"
    :href="href"
    link
    :prepend-icon="icon"
    :title="title"
    @click.prevent="router.push(href || '#')"
  />
</template>

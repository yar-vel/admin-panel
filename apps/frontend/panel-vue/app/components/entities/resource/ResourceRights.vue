<script setup lang="ts">
const { roleId, resource, rights } = defineProps<{
  roleId: string
  resource: IResource
  rights?: IRights
}>()
const emit = defineEmits<{
  update: [value: IRights]
}>()

const newRights = computed(() => rights ?? {
  roleId,
  resourceId: resource.id,
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
})
</script>

<template>
  <fieldset class="fieldset mr-6">
    <v-card-subtitle
      class="px-0 pt-0 pb-3"
      tag="legend"
    >
      {{ resource.name }}
    </v-card-subtitle>
    <v-card-text
      class="px-0 pt-0 pb-3"
      tag="legend"
    >
      {{ resource.description }}
    </v-card-text>
    <FormCheckbox
      :label="$t('create')"
      :model-value="newRights.creating"
      :name="`${resource.name}.creating`"
      @update:model-value="emit('update', { ...newRights, creating: Boolean($event) })"
    />
    <FormCheckbox
      :label="$t('read')"
      :model-value="newRights.reading"
      :name="`${resource.name}.reading`"
      @update:model-value="emit('update', { ...newRights, reading: Boolean($event) })"
    />
    <FormCheckbox
      :label="$t('update')"
      :model-value="newRights.updating"
      :name="`${resource.name}.updating`"
      @update:model-value="emit('update', { ...newRights, updating: Boolean($event) })"
    />
    <FormCheckbox
      :label="$t('delete')"
      :model-value="newRights.deleting"
      :name="`${resource.name}.deleting`"
      @update:model-value="emit('update', { ...newRights, deleting: Boolean($event) })"
    />
  </fieldset>
</template>

<style scoped lang="scss">
.fieldset {
  border-style: unset;
}
</style>

<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const props = defineProps<{
  initialData?: IResource
  createShow?: boolean
  createDisabled?: boolean
  createLoading?: boolean
  updateShow?: boolean
  updateDisabled?: boolean
  updateLoading?: boolean
  deleteShow?: boolean
  deleteDisabled?: boolean
  deleteLoading?: boolean
}>()
const emit = defineEmits<{
  create: [value: TResourceCreate]
  update: [value: TResourceUpdate]
  delete: []
}>()

const data = reactive<IResource>(props.initialData ?? {
  id: '',
  name: '',
  path: '',
  description: '',
  default: false,
  enabled: false,
})
const nameIsValid = (value: string) => value.length > 0
const pathIsValid = (value: string) => value.length > 0

async function handleSubmit(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  if (props.createShow) {
    emit('create', {
      name: data.name,
      path: data.path,
      description: data.description,
      enabled: data.enabled,
    })
  }

  if (props.updateShow) {
    emit('update', {
      name: data.name,
      path: data.path,
      description: data.description,
      enabled: data.enabled,
    })
  }
}
</script>

<template>
  <FormBase @submit="handleSubmit">
    <FormField
      :label="$t('name')"
      :model-value="data.name"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="data.name = $event ?? ''"
    />
    <FormField
      :label="$t('path')"
      :model-value="data.path"
      name="path"
      required
      :rules="[pathIsValid]"
      @update:model-value="data.path = $event ?? ''"
    />
    <FormField
      :label="$t('description')"
      :model-value="data.description ?? ''"
      name="description"
      @update:model-value="data.description = $event"
    />
    <FormCheckbox
      :label="$t('enabled')"
      :model-value="data.enabled"
      name="enabled"
      @update:model-value="data.enabled = Boolean($event)"
    />
    <FormButton
      v-if="createShow"
      :disabled="createDisabled"
      :loading="createLoading"
      color="info"
      prepand-icon="mdi-plus"
      type="submit"
    >
      {{ $t('create') }}
    </FormButton>
    <FormButton
      v-if="updateShow"
      :disabled="updateDisabled"
      :loading="updateLoading"
      color="success"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
    <FormButton
      v-if="deleteShow"
      :disabled="deleteDisabled"
      :loading="deleteLoading"
      color="error"
      prepand-icon="mdi-delete"
      type="button"
      @click="emit('delete')"
    >
      {{ $t('delete') }}
    </FormButton>
  </FormBase>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types'
import { POSITION, useToast } from 'vue-toastification'
import { CommonOptions } from 'vue-toastification/dist/types/types'
import { agentFormSchema } from '@/components/shared/schemas'

const toast = useToast()
const toastOptions: CommonOptions = {
  position: POSITION.TOP_RIGHT
}

const requestTypeOptions = [
  {
    name: 'Dúvidas',
    value: 'duvida'
  },
  {
    name: 'Problema',
    value: 'problema'
  },
  {
    name: 'Outros',
    value: 'outros'
  }
]
const subjectOptions = [
  {
    name: 'Suporte Técnico',
    value: 'suporte_tecnico_interno'
  },
  {
    name: 'Solicitação de Negócio',
    value: 'solicitacao_de_negocio'
  }
]

const formId = useAttrs()['form-id'] as string

interface DefaultValues {
  formId: string | null
  email: string | null
  messageTitle: string | null
  description: string | null
  requestType: string | null
  subject: string | null
  fullName: string | null
  requestAttachments: {
    name: string | null
    file: Blob | null
  }
}

const defaultValues: DefaultValues = {
  formId,
  email: null,
  messageTitle: null,
  description: null,
  requestType: null,
  subject: null,
  fullName: null,
  requestAttachments: {
    name: null,
    file: null
  }
}
const state = ref({
  ...defaultValues
})

let isLoading = ref(false)
let fileInput = ref()

const selectedFileChanged = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input?.files?.length === 0) {
    console.log('No file selected.')
    return
  }
  const file = input?.files?.[0] as File
  const localFile = await fetch(URL.createObjectURL(file))
  const blob = await localFile.blob()

  state.value.requestAttachments.file = blob
  state.value.requestAttachments.name = file.name
}

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  try {
    const { $recaptcha } = useNuxtApp()
    const token = await $recaptcha.execute('submitAgentForm')
    if (!token) throw new Error('Recaptcha failed')

    const { file, name } = state.value.requestAttachments
    if (file && name) {
      const formData = new FormData()
      formData.append('file', file, name)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      }).then((result) => result.json())

      if (res.token) {
        event.data.fileToken = res.token
        event.data.fileName = state.value.requestAttachments.name
      }
    }
    const response = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event.data)
    })

    if (!response.ok) {
      throw new Error('Failed to submit form')
    }
    toast.success('Solicitação enviada com sucesso! 😁', toastOptions)
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error(
      'Algo deu errado 😥, por favor tente novamente em alguns minutos...',
      toastOptions
    )
  } finally {
    isLoading.value = false
    state.value = defaultValues
    fileInput.value = null
  }
}
</script>

<template>
  <div>
    <h1 class="text-[1.5rem] text-xs-[2rem] font-bold mb-4">
      Enviar uma requisicão para o departamento de TI
    </h1>
    <UForm
      id="request-form-agent"
      :state="state"
      :schema="agentFormSchema"
      class="space-y-4 mb-4"
      @submit="onSubmit"
    >
      <UFormGroup label="Endereço de e-mail *" name="email">
        <UInput v-model="state.email" placeholder="exemplo@example.com" />
      </UFormGroup>

      <UFormGroup label="Nome completo *" name="fullName">
        <UInput v-model="state.fullName" />
      </UFormGroup>

      <UFormGroup label="Título da mensagem *" name="messageTitle">
        <UInput v-model="state.messageTitle" />
      </UFormGroup>

      <UFormGroup label="Descrição *" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="Tipo de solicitação *" name="requestType">
        <USelect
          v-model="state.requestType"
          :options="requestTypeOptions"
          option-attribute="name"
          placeholder="-"
        />
      </UFormGroup>

      <UFormGroup label="Assunto *" name="subject">
        <USelect
          v-model="state.subject"
          :options="subjectOptions"
          option-attribute="name"
          placeholder="-"
        />
      </UFormGroup>

      <!-- label="Anexos (opcional)" -->
      <UFormGroup name="requestAttachments" class="custom-label">
        <div class="text-gray-200 text-[13px] font-normal">
          Anexos (opcional)
        </div>
        <div class="flex items-center justify-center w-full">
          <label
            class="flex flex-col items-center justify-center w-full border-2 border-primary rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 hover:border-purple-500 hover:bg-gray-600"
          >
            <div class="flex flex-col items-center justify-center py-3">
              <p class="text-md text-white">
                <span v-if="!fileInput" class="font-semibold"
                  >Clique para anexar um arquivo
                </span>
                <span v-else class="font-semibold">{{
                  state.requestAttachments.name
                }}</span>
              </p>
            </div>
            <UInput
              @change="selectedFileChanged"
              accept="image/*"
              type="file"
              placeholder="Adicione um arquivo"
              id="dropzone-file"
              class="hidden"
              v-model="fileInput"
            />
          </label>
        </div>
        <small class="text-sm text-gray-300"
          >Somente imagens Ex: .png, .jpg</small
        >
      </UFormGroup>

      <input
        id="form-id"
        v-model="state.formId"
        hidden="true"
        aria-hidden="true"
        inputClass="hidden"
      />

      <UButton
        block
        type="submit"
        size="lg"
        variant="solid"
        color="primary"
        :loading="isLoading"
        :ui="{ base: 'max-w-[200px] mx-auto' }"
        class="mt-4"
      >
        {{ isLoading ? '' : 'Enviar' }}
      </UButton>
    </UForm>
  </div>
</template>

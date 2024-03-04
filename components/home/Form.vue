<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '#ui/types'
import { cpf } from 'cpf-cnpj-validator'
import { POSITION, useToast } from 'vue-toastification'
import { CommonOptions } from 'vue-toastification/dist/types/types'
// import { useReCaptcha } from 'vue-recaptcha-v3'

// let recaptchaInstance = useReCaptcha()
// const recaptcha = async () => {
//   console.log('recaptcha')

//   await recaptchaInstance?.recaptchaLoaded()
//   const token = await recaptchaInstance?.executeRecaptcha('send_request_form')
//   return token
// }
const toast = useToast()
const toastOptions: CommonOptions = {
  position: POSITION.TOP_CENTER
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
    value: 'suporte_tecnico'
  }
]

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validates email format
    .required()
    .custom((value, helpers) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return helpers.message({ custom: 'Digite um Email válido' })
      }
      return value
    }, 'Email Validation')
    .messages({
      'any.required': `E-mail não pode ficar em branco`,
      '*': 'Digite um e-mail válido'
    }),
  messageTitle: Joi.string().required().messages({
    '*': `Título da mensagem não pode ficar em branco`
  }),
  description: Joi.string().required().messages({
    '*': `Descrição não pode ficar em branco`
  }),
  requestType: Joi.string()
    .default(null)
    .valid('duvida', 'problema', 'outros')
    .required()
    .messages({
      'any.required': `Escolha uma opção`
    }),
  subject: Joi.string().required().messages({
    'any.required': `Escolha uma opção`
  }),
  fullName: Joi.string().required().messages({
    '*': `Nome completo não pode ficar em branco`
  }),
  cpf: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!cpf.isValid(value)) {
        return helpers.message({ custom: 'CPF inválido' })
      }
      return value
    }, 'CPF Validation')
    .messages({
      'any.required': 'CPF inválido',
      'string.empty': 'CPF inválido'
    }),
  phone: Joi.string()
    .required()
    .custom((value, helpers) => {
      // Check if the numericValue matches the expected format
      if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(value)) {
        return helpers.message({
          custom: 'O telefone deve seguir o formato (##) #####-####'
        })
      }
      // Check if all values in the string are the same
      function allEqual(input: string) {
        return input.split('').every((char) => char === input[0])
      }
      // Check if all values in the string are the same
      const numericValue = value.replace(/\D/g, '')
      if (allEqual(numericValue)) {
        return helpers.message({
          custom: 'Insira um telefone válido'
        })
      }
      return value
    }, 'Phone Validation')
    .messages({
      'any.required': `Telefone não pode ficar em branco`,
      'string.empty': 'Telefone não pode ficar em branco'
    }),
  orderNumber: Joi.string()
    .allow('', null)
    .custom((value, helpers) => {
      if (value && !/^\d+$/.test(value)) {
        // Check if the value contains only numbers
        return helpers.message({
          custom: 'O número do pedido deve conter apenas números'
        })
      }
      return value
    }, 'Order Number Validation'),
  requestAttachments: Joi.any()
})

const state = reactive({
  email: undefined,
  messageTitle: undefined,
  description: undefined,
  requestType: undefined,
  subject: undefined,
  fullName: undefined,
  cpf: undefined,
  phone: undefined,
  orderNumber: undefined,
  requestAttachments: undefined
})

let isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  try {
    // const token = await recaptcha()
    // console.log('token', token)

    // if (!token) {
    //   return
    // }
    let inputFile: any =[]
    let tokenRes
    if (state.requestAttachments) {
      const formData = new FormData()
      formData.append('file', inputFile)
      tokenRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      }).then((res) => res.json())
    }
    if (tokenRes?.token) {
      event.data.fileToken = tokenRes.token
    }
    const response = await fetch('/api/form', {
      method: 'POST',
      // Convert form data to JSON string
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event.data),
    })

    if (!response?.ok) {
      throw new Error('Failed to submit form')
    }

    // Form submitted successfully
    toast.success('Solicitação enviada com sucesso! 😁', toastOptions)
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error(
      'Algo deu errado 😥, por favor tente novamente em alguns minutos...',
      toastOptions
    )
  } finally {
    isLoading.value = false
    state.email = undefined
    state.messageTitle = undefined
    state.description = undefined
    state.requestType = undefined
    state.subject = undefined
    state.fullName = undefined
    state.cpf = undefined
    state.phone = undefined
    state.orderNumber = undefined
  }
}

const handleFileChange = (event: any) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }
  state.requestAttachments = file
}


</script>

<template>
  <div
    class="mx-auto max-w-2xl mb-12 px-4 pb-4 lg:px-8 bg-[#23282C] text-white"
  >
    <h1 class="text-[1.5rem] text-xs-[2rem] font-bold mb-4">
      Enviar uma solicitação
    </h1>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 mb-4"
      @submit="onSubmit"
    >
      <UFormGroup label="Endereço de e-mail *" name="email">
        <UInput v-model="state.email" placeholder="exemplo@example.com" />
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

      <UFormGroup label="Nome completo *" name="fullName">
        <UInput v-model="state.fullName" />
      </UFormGroup>

      <UFormGroup label="CPF *" name="cpf">
        <UInput
          v-model="state.cpf"
          v-mask="'###.###.###-##'"
          placeholder="000.000.000-00"
        />
      </UFormGroup>

      <UFormGroup label="Telefone *" name="phone">
        <UInput
          v-model="state.phone"
          v-mask="'(##) #####-####'"
          placeholder="(00) 00000-0000"
        />
      </UFormGroup>

      <UFormGroup label="Número do pedido (se existir)" name="orderNumber">
        <UInput v-model="state.orderNumber" />
      </UFormGroup>

      <UFormGroup
        label="Anexos (opcional)"
        name="requestAttachments"
        class="custom-label"
      >
        <UInput
          @change="handleFileChange"
          accept="image/*"
          type="file"
          placeholder="Adicione um arquivo"
        />
      </UFormGroup>

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

    <!-- <SharedRecaptchaPrivacyAndTerms class="mx-auto" /> -->
  </div>
</template>

<style lang="scss" scoped>
// label {
//   color: white;
// }
//
</style>

<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '#ui/types'
import { cpf } from 'cpf-cnpj-validator'
import { POSITION, useToast } from 'vue-toastification'
import { CommonOptions } from 'vue-toastification/dist/types/types'

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
      '*': `Escolha uma opção`
    }),
  subject: Joi.string().required().messages({
    '*': `Escolha uma opção`
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
      '*': 'CPF inválido'
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
      '*': `Insira um telefone válido`
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
    }, 'Order Number Validation')
})

const defaultValues = {
  email: null,
  messageTitle: null,
  description: null,
  requestType: null,
  subject: null,
  fullName: null,
  cpf: null,
  phone: null,
  orderNumber: null
}
const state = ref({
  ...defaultValues
})

let isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  try {
    const { $recaptcha } = useNuxtApp()
    // @ts-ignore
    const token = await $recaptcha.execute('login')
    if (!token) throw new Error('Recaptcha failed')

    const response = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event.data)
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
    state.value = defaultValues
  }
}
</script>

<template>
  <div
    
  >
    <h1 class="text-[1.5rem] text-xs-[2rem] font-bold mb-4">
      Enviar uma solicitação
    </h1>

    <UForm
      id="request-form"
      :state="state"
      :schema="schema"
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

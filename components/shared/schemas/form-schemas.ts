import Joi from 'joi'
import { cpf } from 'cpf-cnpj-validator'

export const userFormSchema = Joi.object({
  formId: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
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
      // Check if the value contains only numbers
      if (value && !/^\d+$/.test(value)) {
        return helpers.message({
          custom: 'O número do pedido deve conter apenas números'
        })
      }
      return value
    }, 'Order Number Validation'),
  requestAttachments: Joi.object({
    name: Joi.string().allow('', null),
    file: Joi.any()
  })
})

export const agentFormSchema = Joi.object({
  formId: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
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
  fullName: Joi.string().required().messages({
    '*': `Nome completo não pode ficar em branco`
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
  requestAttachments: Joi.object({
    name: Joi.string().allow('', null),
    file: Joi.any()
  })
})

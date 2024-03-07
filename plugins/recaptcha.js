export default defineNuxtPlugin((nuxtApp) => {
  const { grecaptcha } = useRuntimeConfig().public
  // nuxtApp.provide('recaptcha', new ReCaptcha(grecaptcha))
  return {
    provide: {
      recaptcha: new ReCaptcha(grecaptcha)
    }
  }
})

const API_URL = 'https://www.recaptcha.net/recaptcha/api.js'

// https://github.com/PierfrancescoSoffritti/light-event-bus.js/blob/master/src/EventBus.js
function EventBus() {
  const subscriptions = {}

  this.subscribe = function subscribeCallbackToEvent(eventType, callback) {
    const id = Symbol('id')
    if (!subscriptions[eventType]) subscriptions[eventType] = {}
    subscriptions[eventType][id] = callback
    return {
      unsubscribe: function unsubscribe() {
        delete subscriptions[eventType][id]
        if (
          Object.getOwnPropertySymbols(subscriptions[eventType]).length === 0
        ) {
          delete subscriptions[eventType]
        }
      }
    }
  }

  this.publish = function publishEventWithArgs(eventType, arg) {
    if (!subscriptions[eventType]) return

    Object.getOwnPropertySymbols(subscriptions[eventType]).forEach((key) =>
      subscriptions[eventType][key](arg)
    )
  }
}

class ReCaptcha {
  constructor({ hideBadge, language, mode, siteKey, version, size }) {
    if (!siteKey) {
      throw new Error('ReCaptcha error: No key provided')
    }

    if (!version) {
      throw new Error('ReCaptcha error: No version provided')
    }

    this._elements = {}
    this._grecaptcha = null

    this._eventBus = null
    this._ready = false

    this.hideBadge = hideBadge
    this.language = language

    this.siteKey = siteKey
    this.version = version
    this.size = size

    this.mode = mode
  }

  destroy() {
    if (this._ready) {
      this._ready = false

      const { head } = document
      const { style } = this._elements

      const scripts = [...document.head.querySelectorAll('script')].filter(
        (script) => script.src.includes('recaptcha')
      )

      if (scripts.length) {
        scripts.forEach((script) => head.removeChild(script))
      }

      if (head.contains(style)) {
        head.removeChild(style)
      }

      const badge = document.querySelector('.grecaptcha-badge')
      if (badge) {
        badge.remove()
      }
    }
  }

  async execute(action) {
    try {
      await this.init()

      if ('grecaptcha' in window) {
        return this._grecaptcha.execute(this.siteKey, { action })
      }
    } catch (error) {
      throw new Error(`ReCaptcha error: Failed to execute ${error}`)
    }
  }

  getResponse(widgetId) {
    return new Promise((resolve, reject) => {
      if ('grecaptcha' in window) {
        if (this.size == 'invisible') {
          this._grecaptcha.execute(widgetId)

          window.recaptchaSuccessCallback = (token) => {
            this._eventBus.publish('recaptcha-success', token)
            resolve(token)
          }

          window.recaptchaErrorCallback = (error) => {
            this._eventBus.publish('recaptcha-error', error)
            reject(error)
          }
        } else {
          const response = this._grecaptcha.getResponse(widgetId)

          if (response) {
            this._eventBus.publish('recaptcha-success', response)
            resolve(response)
          } else {
            const errorMessage = 'Failed to execute'

            this._eventBus.publish('recaptcha-error', errorMessage)
            reject(errorMessage)
          }
        }
      }
    })
  }

  init() {
    if (this._ready) {
      // make sure caller waits until recaptcha get ready
      return this._ready
    }

    this._eventBus = new EventBus()
    this._elements = {
      script: document.createElement('script'),
      style: document.createElement('style')
    }

    const { script, style } = this._elements

    script.setAttribute('async', '')
    script.setAttribute('defer', '')

    const params = []
    if (this.version === 3) {
      params.push('render=' + this.siteKey)
    }
    if (this.language) {
      params.push('hl=' + this.language)
    }

    let scriptUrl = API_URL

    if (this.mode === 'enterprise') {
      scriptUrl = scriptUrl.replace('api.js', 'enterprise.js')
      params.push('render=' + this.siteKey)
    }

    script.setAttribute('src', scriptUrl + '?' + params.join('&'))

    window.recaptchaSuccessCallback = (token) =>
      this._eventBus.publish('recaptcha-success', token)
    window.recaptchaExpiredCallback = () =>
      this._eventBus.publish('recaptcha-expired')
    window.recaptchaErrorCallback = () =>
      this._eventBus.publish('recaptcha-error', 'Failed to execute')

    this._ready = new Promise((resolve, reject) => {
      script.addEventListener('load', () => {
        if (this.version === 3 && this.hideBadge) {
          style.innerHTML = '.grecaptcha-badge { display: none }'
          document.head.appendChild(style)
        } else if (this.version === 2 && this.hideBadge) {
          // display: none DISABLES the spam checking!
          // ref: https://stackoverflow.com/questions/44543157/how-to-hide-the-google-invisible-recaptcha-badge
          style.innerHTML = '.grecaptcha-badge { visibility: hidden; }'
          document.head.appendChild(style)
        }

        this._grecaptcha = window.grecaptcha.enterprise || window.grecaptcha
        this._grecaptcha.ready(resolve)
      })

      script.addEventListener('error', () => {
        document.head.removeChild(script)
        reject('ReCaptcha error: Failed to load script')
        this._ready = null
      })

      document.head.appendChild(script)
    })

    return this._ready
  }

  on(event, callback) {
    return this._eventBus.subscribe(event, callback)
  }

  reset(widgetId) {
    if (this.version === 2 || typeof widgetId !== 'undefined') {
      this._grecaptcha.reset(widgetId)
    }
  }

  render(reference, { sitekey, theme }) {
    return this._grecaptcha.render(reference.$el || reference, {
      sitekey,
      theme
    })
  }
}

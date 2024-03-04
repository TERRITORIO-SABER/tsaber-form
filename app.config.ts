export default defineAppConfig({
  ui: {
    // strategy: 'override',
    primary: 'purple',
    formGroup: {
      label: {
        base: 'text-white text-[13px] font-normal'
      },
      error:
        'mt-2 text-red-500 bg-red-100 border border-red-500 rounded-md px-2 py-1'
    },
    input: {
      color: {
        white: {
          outline:
            'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
        }
      }
    }
  }
})

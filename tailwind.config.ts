import { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  plugins: [
    // require('@tailwindcss/forms'),
  ],
  theme: {
    extend: {
      fontFamily: {
        headins: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
        body: ['"Libre Franklin"', ...defaultTheme.fontFamily.sans],
      }
    }
  },

}

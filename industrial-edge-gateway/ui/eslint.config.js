import pluginVue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist', 'node_modules'] },
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'vue/no-mutating-props': 'off',
      'vue/valid-v-slot': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  }
]

import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.vscode/**',
      '**/.github/**',
      '**/public/**',
    ],
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx,mjs,cjs}'],
  },
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    name: 'app/custom-rules',
    rules: {
      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Vue.js rules - Quality focused, not formatting
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/multi-word-component-names': 'off',

      // Disable formatting rules that conflict with Prettier
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/mustache-interpolation-spacing': 'off',
      'vue/no-multi-spaces': 'off',
      'vue/no-spaces-around-equal-signs-in-attribute': 'off',

      // General JavaScript/TypeScript rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      'no-lonely-if': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'array-callback-return': 'error',
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'no-return-await': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-useless-return': 'error',
      'no-useless-constructor': 'error',
      'no-useless-concat': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'no-useless-escape': 'error',
      'no-implicit-coercion': [
        'error',
        {
          boolean: false,
        },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Vue specific overrides
      'no-undef': 'off', // Vue compiler macros
    },
  },
  {
    files: ['**/*.config.{js,ts}', 'scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
]

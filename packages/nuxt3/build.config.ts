import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  // emitCJS: true,
  entries: [
    'src/module',
    {
      input: 'src/runtime/',
      outDir: 'dist/runtime',
      format: 'esm',
      declaration: true
    }
  ]
})

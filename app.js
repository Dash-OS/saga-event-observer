export default {
  name: 'saga-event-observer',
  
  webpack: {
    libraryTarget: 'umd',
  },
  
  babel: {
    plugins: [
      'transform-class-properties'
    ],
    presets: [
      'stage-0',
      ['env', {
        modules: false
      }],
    ],
    env: {
      production: {
        presets: [ 
          ['babili', {}],
        ]
      }
    }
  },
  
}

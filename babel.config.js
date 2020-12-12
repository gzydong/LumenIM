module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    [
      "prismjs",
      {
        "languages": [
          "html",
          "css",
          "less",
          "javascript",
          "typescript",
          "json",
          "xml",
          "bash",
          "nginx",
          "sql",
          "docker",
          "php",
          "java",
          "go",
          "python",
          "ruby",
          "rust",
          "objectivec",
          "c",
          "csharp",
          "cpp",
          "lua",
          "shell",
          "vim",
          "yaml",
          "yml",
          "md",
          "erlang",
          "ini"
        ],
        "theme": "okaidia"
      }
    ]
  ]
}
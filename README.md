# webpack-inline-svg-plugin
Inline Svgs from an image tag to full svg markup

## Usage

### Install

```
npm install --save-dev webpack-inline-svg-plugin
```

### Example
Add the following to your webpack.js

```
module.exports = function (options) {
  plugins: [
	new WebpackInlineSvgPlugin({
	  basePath: "my-app/asset/location",
	  patterns: [
		".html"
	  ]
	}),
  ]
}
```

In your markup add the `inline-svg` attribute

```
<img inline-svg class="logo" title="Logo" src="assets/icons/logo.svg">
```

The result will be the full svg file content will replace this image tag.

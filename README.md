# hypercard

A web component to add a three-dimensional hover effect to any arbitrary content.

**Full credit to this [3D card hover effect CodePen from Mark Miro](https://codepen.io/markmiro/pen/wbqMPa).**

* [Demo](https://zachleat.github.io/hypercard/demo.html)
	* In use on the registration flow for [`conf.11ty.dev`](https://conf.11ty.dev/).
* [Blog post](https://www.zachleat.com/web/hypercard/)

## Features

* Respects `prefers-reduced-motion`.
* Customize scale with `--hypercard-scale` CSS custom property.

## Installation

You can install via `npm` ([`@zachleat/hypercard`](https://www.npmjs.com/package/@zachleat/hypercard)) or download the `hypercard.js` JavaScript file manually.

```shell
npm install @zachleat/hypercard --save
```

Add `hypercard.js` to your site’s JavaScript assets.

## Usage

```html
<hyper-card>Hello.</hyper-card>
```

### Not quite as big on hover

The default value is `1.07`.

```html
<hyper-card style="--hypercard-scale: 1.03">Hello.</hyper-card>
```
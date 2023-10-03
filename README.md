# Rendify
Addition javascript plugin for Rendify client site.

### Usage
Add following html script tag where you want Rendify catalogue in you HTML tree.

`<script id="rendifyscript" customer="#" items="#" theme="#" zoom="#" src="https://krs087.github.io/rendify/rendify.js"></script>`

Demo: https://krs087.github.io/rendify/demo.html

#### Customization
* customer: Rendify customer ID (important to set)
* items: number of items shown (not need to set, default: 12)
* theme: set Rendify theme (not need to set, can use empty or "shadow", default empty)
* zoom: set Rendify catalogue overall zoom level in percentages (not need to set, can be 0 - 100, default 100)

#### Example of default (minimum variations usage)
`<script id="rendifyscript" customer="141" src="https://krs087.github.io/rendify/rendify.js"></script>`

#### Example of full usage
`<script id="rendifyscript" customer="141" items="6" theme="" zoom="90" src="http://rendify.localhost/jsplugin/rendify.js"></script>`

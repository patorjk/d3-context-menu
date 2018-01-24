# d3-context-menu

This is a plugin for d3.js that allows you to easy use context-menus in your visualizations. It's 100% d3 based and done in the "d3 way", so you don't need to worry about including additional frameworks.

It's written to be very light weight and customizable. You can see it in action here:

http://plnkr.co/edit/hAx36JQhb0RsvVn7TomS?p=info

### Install with Bower

```
bower install d3-context-menu
```

### Basic usage:

```
// Define your menu
var menu = [
	{
		title: 'Item #1',
		action: function(d, i) {
			console.log('Item #1 clicked!');
			console.log('The data for this circle is: ' + d);
		},
		disabled: false // optional, defaults to false
	},
	{
		title: 'Item #2',
		action: function(d, i) {
			console.log('You have clicked the second item!');
			console.log('The data for this circle is: ' + d);
		}
	}
]

var data = [1, 2, 3];

var g = d3.select('body').append('svg')
	.attr('width', 200)
	.attr('height', 400)
	.append('g');

g.selectAll('circles')
	.data(data)
	.enter()
	.append('circle')
	.attr('r', 30)
	.attr('fill', 'steelblue')
	.attr('cx', function(d) {
		return 100;
	})
	.attr('cy', function(d) {
		return d * 100;
	})
	.on('contextmenu', d3.contextMenu(menu)); // attach menu to element
});
```

### Advanced usage:

#### Headers and Dividers

Menus can have Headers and Dividers. To specify a header simply don't define an "action" property. To specify a divider, simply add a "divider: true" property to the menu item, and it'll be considered a divider. Example menu definition:

```
		var menu = [
			{
				title: 'Header',
			},
			{
				title: 'Normal item',
				action: function() {}
			},
			{
				divider: true
			},
			{
				title: 'Last item',
				action: function() {}
			}
		];

```

See the index.htm file in the example folder to see this in action.

#### Pre-show callback

You can pass in a callback that will be executed before the context menu appears. This can be useful if you need something to close tooltips or perform some other task before the menu appears:

```
	...
	.on('contextmenu', d3.contextMenu(menu, function() {
		console.log('Quick! Before the menu appears!');
	})); // attach menu to element

```

#### Post-show callback

You can pass in a callback that will be executed after the context menu appears using the onClose option:

```
	...
	.on('contextmenu', d3.contextMenu(menu, {
		onOpen: function() {
			console.log('Quick! Before the menu appears!');
		},
		onClose: function() {
			console.log('Menu has been closed.');
		}
	})); // attach menu to element

```

#### Context-sensitive menu items

You can use information from your context in menu names, simply specify a function for title which returns a string:

```
var menu = [
	{
		title: function(d) {
			return 'Delete circle '+d.circleName;
		},
		action: function(d, i) {
			// delete it
		}
	},
	{
		title: function(d) {
			return 'Item 2';
		},
		action: function(d, i) {
			// do nothing interesting
		}
	}
];

// Menu shown is:

[Delete Circle MyCircle]
[Item 2]
```
	
#### Dynamic menu list

You can also have different lists of menu items for different nodes if `menu` is a function:

```
var menu = function(data) {
	if (data.x > 100) {
		return [{
			title: 'Item #1',
			action: function(d, i) {
				console.log('Item #1 clicked!');
				console.log('The data for this circle is: ' + d);
			}
		}];
	} else {
		return [{
			title: 'Item #1',
			action: function(d, i) {
				console.log('Item #1 clicked!');
				console.log('The data for this circle is: ' + d);
			}
		}, {
			title: 'Item #2',
			action: function(d, i) {
				console.log('Item #2 clicked!');
				console.log('The data for this circle is: ' + d);
			}
		}];
	}
};

// Menu shown for nodes with x < 100 contains 1 item, while other nodes have 2 menu items

```
	
#### Deleting Nodes Example

The following example shows how to add a right click menu to a tree diagram:

http://plnkr.co/edit/bDBe0xGX1mCLzqYGOqOS?p=info

#### Explicitly set menu position

Default position can be overwritten by providing a `position` option (either object or function returning an object):

```
	...
	.on('contextmenu', d3.contextMenu(menu, {
		onOpen: function() {
			...
		},
		onClose: function() {
			...
		},
		position: {
			top: 100,
			left: 200
		}
	})); // attach menu to element

```

or

```
	...
	.on('contextmenu', d3.contextMenu(menu, {
		onOpen: function() {
			...
		},
		onClose: function() {
			...
		},
		position: function(d, i) {
			var elm = this;
			var bounds = elm.getBoundingClientRect();

			// eg. align bottom-left
			return {
				top: bounds.top + bounds.height,
				left: bounds.left
			}
		}
	})); // attach menu to element

```

#### Set your own CSS class as theme (make sure to style it)

```
d3.contextMenu(menu, {
	...
	theme: 'my-awesome-theme'
});
```

or

```
d3.contextMenu(menu, {
	...
	theme: function () {
		if (foo) {
			return 'my-foo-theme';
		}
		else {
			return 'my-awesome-theme';
		}
	}
});
```

#### Close the context menu programatically (can be used as cleanup, as well)

```
d3.contextMenu('close');
```

The following example shows how to add a right click menu to a tree diagram:

http://plnkr.co/edit/bDBe0xGX1mCLzqYGOqOS?p=info

### What's new in version 1.0.1
* Default theme styles extracted to their own CSS class (`d3-context-menu-theme`)
* Ability to specify own theme css class via the `theme` configuration option (as string or function returning string)
* onOpen/onClose callbacks now have consistent signature (they receive `data` and `index`, and `this` argument refers to the DOM element the context menu is related to)
* all other functions (eg. `position`, `menu`) have the same signature and `this` object as `onClose`/`onOpen`
* Context menu now closes on `mousedown` outside of the menu, instead of `click` outside (to mimic behaviour of the native context menu)
* `disabled` and `divider` can now be functions as well and have the same signature and `this` object as explained above
* Close the context menu programatically using `d3.contextMenu('close');`

### What's new in version 0.2.1
* Ability to set menu position
* Minified css and js versions

### What's new in version 0.1.3
* Fixed issue where context menu element is never removed from DOM
* Fixed issue where `<body>` click event is never removed
* Fixed issue where the incorrect `onClose` callback was called when menu was closed as a result of clicking outside

### What's new in version 0.1.2

* If contextmenu is clicked twice it will close rather than open the browser's context menu.

### What's new in version 0.1.1

* Header and Divider items.
* Ability to disable items.

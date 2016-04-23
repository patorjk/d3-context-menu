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
		action: function(elm, d, i) {
			console.log('Item #1 clicked!');
			console.log('The data for this circle is: ' + d);
		},
		disabled: false // optional, defaults to false
	},
	{
		title: 'Item #2',
		action: function(elm, d, i) {
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
		action: function(elm, d, i) {
			// delete it
		}
	},
	{
		title: function(d) {
			return 'Item 2';
		},
		action: function(elm, d, i) {
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
			action: function(elm, d, i) {
				console.log('Item #1 clicked!');
				console.log('The data for this circle is: ' + d);
			}
		}];
	} else {
		return [{
			title: 'Item #1',
			action: function(elm, d, i) {
				console.log('Item #1 clicked!');
				console.log('The data for this circle is: ' + d);
			}
		}, {
			title: 'Item #2',
			action: function(elm, d, i) {
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

### What's new in version 0.1.1

* Header and Divider items.
* Ability to disable items.

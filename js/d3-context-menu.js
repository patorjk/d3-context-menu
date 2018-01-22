(function(root, factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = function(d3) {
			d3.contextMenu = factory(d3);
			return d3.contextMenu;
		};
	} else if(typeof define === 'function' && define.amd) {
		try {
			var d3 = require('d3');
		} catch (e) {
			d3 = root.d3;
		}

		d3.contextMenu = factory(d3);
		define([], function() {
			return d3.contextMenu;
		});
	} else if(root.d3) {
		root.d3.contextMenu = factory(root.d3);
	}
}(	this,
	function(d3) {
		return function (menu, opts) {

			var openCallback,
				closeCallback;

			if (typeof opts === 'function') {
				openCallback = opts;
			} else {
				opts = opts || {};
				openCallback = opts.onOpen;
				closeCallback = opts.onClose;
			}

			var createMenu = function () {
				// create the div element that will hold the context menu
				d3.selectAll('.d3-context-menu').data([1])
					.enter()
					.append('div')
					.attr('class', 'd3-context-menu');
			};

			var closeMenu = function () {
				var contextMenuElm = d3.select('.d3-context-menu');
				d3.select('body').on('click.d3-context-menu', null);

				if (contextMenuElm.size() > 0) {
					contextMenuElm.remove();

					if (closeCallback) {
						closeCallback();
					}
				}
			};

			// this gets executed when a contextmenu event occurs
			return function(data, index) {
				var elm = this;

				// close any menu that's already opened
				closeMenu();

				// create new menu container
				createMenu();

				// close menu on click outside
				d3.select('body').on('click.d3-context-menu', closeMenu);

				var list = d3.selectAll('.d3-context-menu')
					.on('contextmenu', function(d) {
						closeMenu();
						d3.event.preventDefault();
						d3.event.stopPropagation();
					})
					.append('ul');
				list.selectAll('li').data(typeof menu === 'function' ? menu(data) : menu).enter()
					.append('li')
					.attr('class', function(d) {
						var ret = '';
						if (d.divider) {
							ret += ' is-divider';
						}
						if (d.disabled) {
							ret += ' is-disabled';
						}
						if (!d.action) {
							ret += ' is-header';
						}
						return ret;
					})
					.html(function(d) {
						if (d.divider) {
							return '<hr>';
						}
						if (!d.title) {
							console.error('No title attribute set. Check the spelling of your options.');
						}
						return (typeof d.title === 'string') ? d.title : d.title(data);
					})
					.on('click', function(d, i) {
						if (d.disabled) return; // do nothing if disabled
						if (!d.action) return; // headers have no "action"
						d.action(elm, data, index);
						closeMenu();
					});

				// the openCallback allows an action to fire before the menu is displayed
				// an example usage would be closing a tooltip
				if (openCallback) {
					if (openCallback(data, index) === false) {
						return;
					}
				}

				//console.log(this.parentNode.parentNode.parentNode);//.getBoundingClientRect());   Use this if you want to align your menu from the containing element, otherwise aligns towards center of window

				var doc = document.documentElement;
				var pageWidth = window.innerWidth || doc.clientWidth;
				var pageHeight = window.innerHeight || doc.clientHeight;

				var horizontalAlignment = 'left';
				var horizontalAlignmentReset = 'right';
				var horizontalValue = d3.event.pageX - 2;
				if (d3.event.pageX > pageWidth/2){
					horizontalAlignment = 'right';
					horizontalAlignmentReset = 'left';
					horizontalValue = pageWidth - d3.event.pageX - 2;
				} 
				

				var verticalAlignment = 'top';
				var verticalAlignmentReset = 'bottom';
				var verticalValue = d3.event.pageY - 2;
				if (d3.event.pageY > pageHeight/2){
					verticalAlignment = 'bottom';
					verticalAlignmentReset = 'top';
					verticalValue = pageHeight - d3.event.pageY - 2	;
				} 

				// display context menu
				d3.select('.d3-context-menu')
					.style(horizontalAlignment, (horizontalValue) + 'px')
					.style(horizontalAlignmentReset, null)
					.style(verticalAlignment, (verticalValue) + 'px')
					.style(verticalAlignmentReset, null)

					.style('display', 'block');

				d3.event.preventDefault();
				d3.event.stopPropagation();
			};
		};
	}
));

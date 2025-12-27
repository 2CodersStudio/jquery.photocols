/**
 * Photocols - Animated photo gallery with scrolling columns/rows
 * @module jquery.photocols
 */

// Default options
const DEFAULTS = {
  bgcolor: '#000',
  width: 'auto',
  colswidth: 200,
  itemheight: 300,
  height: 600,
  gap: 5,
  titleSize: 16,
  subtitleSize: 14,
  opacity: 0.3,
  overlayColor: '#000',
  stopOnHover: true,
  data: [],
  // Configurable positions
  titleTop: 56,
  subtitleTop: 80,
  maskHeight: 120,
  animationSpeed: 1,
  debounceDelay: 150,
  // New options for flexibility
  direction: 'up',            // 'up' | 'down' | 'left' | 'right'
  variableSpeed: false,       // Enable variable speed per row/column
  speedVariation: 0.5,        // Speed variation range (0.5 = 50% to 150% of base speed)
  pauseAllOnHover: false,     // Pause entire gallery on hover
  lazyLoad: false,            // Enable lazy loading of images
  lazyLoadThreshold: 100,     // Pixels before viewport to start loading
  placeholderColor: '#333'    // Background color while image loads
};

/**
 * Debounce utility function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (fn, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * WeakMap to store instances
 */
const instances = new WeakMap();

/**
 * Photocols class - main plugin implementation
 */
class Photocols {
  constructor($, element, options) {
    this.$ = $;
    this.element = element;
    this.$element = $(element);
    this.instanceId = `pc-${Math.random().toString(36).substr(2, 9)}`;
    this.options = $.extend({}, DEFAULTS, options);

    // Validate data
    if (!Array.isArray(this.options.data) || this.options.data.length === 0) {
      console.warn('Photocols: options.data must be a non-empty array');
      return;
    }

    // Validate direction
    const validDirections = ['up', 'down', 'left', 'right'];
    if (!validDirections.includes(this.options.direction)) {
      console.warn(`Photocols: Invalid direction "${this.options.direction}". Using "up".`);
      this.options.direction = 'up';
    }

    // Instance state
    this.rows = 0;
    this.cols = 0;
    this.animationId = null;
    this.isAnimating = false;
    this.isPaused = false;
    this.lastTimestamp = 0;
    this.scrollOffset = 0;
    this.activeColumn = null;
    this.speedMultipliers = [];
    this.columnOffsets = [];
    this.imageObserver = null;

    // Cached DOM references
    this.$container = null;
    this.$columns = [];
    this.$items = [];
    this.$insetShadow = null;

    // Bind methods
    this.handleResize = debounce(this.refresh.bind(this), this.options.debounceDelay);
    this.boundAnimate = this.animate.bind(this);

    // Initialize
    this.init();
  }

  /**
   * Check if scrolling horizontally
   */
  get isHorizontal() {
    return this.options.direction === 'left' || this.options.direction === 'right';
  }

  /**
   * Check if scrolling in reverse direction
   */
  get isReversed() {
    return this.options.direction === 'down' || this.options.direction === 'right';
  }

  /**
   * Get the scroll axis
   */
  get axis() {
    return this.isHorizontal ? 'X' : 'Y';
  }

  /**
   * Get the dimension for calculations
   */
  get dimension() {
    return this.isHorizontal ? 'width' : 'height';
  }

  /**
   * Initialize the plugin
   */
  init() {
    // Set container styles
    this.$element.css({
      width: this.options.width === 'auto' ? '100%' : this.options.width,
      height: this.options.height,
      backgroundColor: this.options.bgcolor,
      overflow: 'hidden',
      position: 'relative'
    });

    // Create layout
    this.createLayout();

    // Setup lazy loading if enabled
    if (this.options.lazyLoad) {
      this.setupLazyLoading();
    }

    // Bind events
    this.bindEvents();

    // Start animation
    this.resume();
  }

  /**
   * Create the gallery layout
   */
  createLayout() {
    const { $ } = this;

    // Clear existing content
    this.$element.empty();
    this.$columns = [];
    this.$items = [];
    this.speedMultipliers = [];
    this.columnOffsets = [];

    const containerWidth = this.$element.width();
    const containerHeight = this.options.height;

    if (this.isHorizontal) {
      // Horizontal layout: create rows
      this.rows = Math.floor(containerHeight / this.options.itemheight);
      if (this.rows < 1) this.rows = 1;

      const itemHeight = Math.floor(containerHeight / this.rows) - this.options.gap;
      this.cols = Math.ceil(containerWidth / this.options.colswidth) + 1;

      // Create main container
      this.$container = $('<div>', {
        id: `${this.instanceId}-all`,
        class: `${this.instanceId}-all pc-all`,
        css: {
          position: 'absolute',
          height: '100%',
          transform: 'translateX(0)'
        }
      });

      // Create rows and items
      let itemIndex = 0;
      for (let i = 0; i < this.rows; i++) {
        const topPosition = Math.round(containerHeight / this.rows);
        const leftOffset = Math.floor(Math.random() * this.options.colswidth);

        // Calculate speed multiplier for this row
        if (this.options.variableSpeed) {
          const variation = this.options.speedVariation;
          this.speedMultipliers[i] = 1 - variation + (Math.random() * variation * 2);
        } else {
          this.speedMultipliers[i] = 1;
        }
        this.columnOffsets[i] = 0;

        const $row = $('<div>', {
          id: `${this.instanceId}-row-${i}`,
          class: `${this.instanceId}-col pc-col pc-row`,
          css: { position: 'absolute' },
          'data-col-index': i
        });

        for (let j = 0; j < this.cols; j++) {
          const itemData = this.options.data[itemIndex++ % this.options.data.length];
          const $item = this.createItem(itemData, {
            width: this.options.colswidth,
            height: itemHeight,
            top: topPosition * i + this.options.gap / 2,
            left: leftOffset + (this.options.colswidth + this.options.gap) * j,
            isHorizontal: true
          });

          $row.append($item);
          this.$items.push($item);
        }

        this.$container.append($row);
        this.$columns.push($row);
      }
    } else {
      // Vertical layout: create columns (original behavior)
      this.cols = Math.floor(containerWidth / this.options.colswidth);
      if (this.cols < 1) this.cols = 1;

      const itemWidth = Math.floor(containerWidth / this.cols) - this.options.gap;
      this.rows = Math.ceil(containerHeight / this.options.itemheight) + 1;

      // Create main container
      this.$container = $('<div>', {
        id: `${this.instanceId}-all`,
        class: `${this.instanceId}-all pc-all`,
        css: {
          position: 'absolute',
          width: '100%',
          transform: 'translateY(0)'
        }
      });

      // Create columns and items
      let itemIndex = 0;
      for (let i = 0; i < this.cols; i++) {
        const leftPosition = Math.round(containerWidth / this.cols);
        const topOffset = Math.floor(Math.random() * this.options.itemheight);

        // Calculate speed multiplier for this column
        if (this.options.variableSpeed) {
          const variation = this.options.speedVariation;
          this.speedMultipliers[i] = 1 - variation + (Math.random() * variation * 2);
        } else {
          this.speedMultipliers[i] = 1;
        }
        this.columnOffsets[i] = 0;

        const $column = $('<div>', {
          id: `${this.instanceId}-col-${i}`,
          class: `${this.instanceId}-col pc-col`,
          css: { position: 'absolute' },
          'data-col-index': i
        });

        for (let j = 0; j < this.rows; j++) {
          const itemData = this.options.data[itemIndex++ % this.options.data.length];
          const $item = this.createItem(itemData, {
            width: itemWidth,
            height: this.options.itemheight,
            left: leftPosition * i + this.options.gap / 2,
            top: topOffset + (this.options.itemheight + this.options.gap) * j,
            isHorizontal: false
          });

          $column.append($item);
          this.$items.push($item);
        }

        this.$container.append($column);
        this.$columns.push($column);
      }
    }

    this.$element.append(this.$container);

    // Create inset shadow overlay
    const shadowStyle = this.isHorizontal
      ? 'inset 10px 0 10px -10px #000, inset -10px 0 10px -10px #000'
      : 'inset 0 10px 10px -10px #000, inset 0 -10px 10px -10px #000';

    this.$insetShadow = $('<div>', {
      id: `${this.instanceId}-shadow`,
      css: {
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        boxShadow: shadowStyle,
        pointerEvents: 'none'
      }
    });

    this.$element.append(this.$insetShadow);

    // Apply styles
    this.applyStyles();
  }

  /**
   * Create a single gallery item
   * @param {Object} data - Item data (title, subtitle, url, img)
   * @param {Object} position - Position styles
   * @returns {jQuery} Item element
   */
  createItem(data, position) {
    const { $ } = this;
    const posAttr = position.isHorizontal ? 'data-left' : 'data-top';
    const posValue = position.isHorizontal ? position.left : position.top;
    const transform = position.isHorizontal
      ? `translateX(${position.left}px)`
      : `translateY(${position.top}px)`;

    const css = {
      overflow: 'hidden',
      position: 'absolute',
      backgroundPosition: '50% 50%',
      backgroundSize: 'cover',
      height: position.height || this.options.itemheight,
      width: position.width,
      display: 'block',
      textDecoration: 'none',
      transform
    };

    // Handle image loading
    if (this.options.lazyLoad) {
      css.backgroundColor = this.options.placeholderColor;
    } else {
      css.backgroundImage = `url(${data.img || ''})`;
    }

    // Set position based on direction
    if (position.isHorizontal) {
      css.top = position.top;
    } else {
      css.left = position.left;
    }

    const $item = $('<a>', {
      class: `${this.instanceId}-item pc-item`,
      href: data.url || '#',
      css,
      [posAttr]: posValue
    });

    // Store image URL for lazy loading
    if (this.options.lazyLoad) {
      $item.attr('data-src', data.img || '');
    }

    // Create overlay
    const $overlay = $('<div>', {
      class: `${this.instanceId}-overlay pc-item-overlay`
    });

    // Create mask with title/subtitle
    const $mask = $('<div>', {
      class: `${this.instanceId}-mask pc-item-mask`
    });

    const $title = $('<span>', {
      class: `${this.instanceId}-title pc-item-title`
    }).text(data.title || '');

    const $subtitle = $('<span>', {
      class: `${this.instanceId}-subtitle pc-item-subtitle`
    }).text(data.subtitle || '');

    $mask.append($title, $subtitle);
    $item.append($overlay, $mask);

    return $item;
  }

  /**
   * Setup lazy loading with IntersectionObserver
   */
  setupLazyLoading() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const $item = this.$(entry.target);
            const src = $item.attr('data-src');
            if (src) {
              $item.css('background-image', `url(${src})`);
              $item.removeAttr('data-src');
              this.imageObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: this.element,
        rootMargin: `${this.options.lazyLoadThreshold}px`
      }
    );

    this.$items.forEach($item => {
      if ($item.attr('data-src')) {
        this.imageObserver.observe($item[0]);
      }
    });
  }

  /**
   * Load all images immediately (fallback for lazy loading)
   */
  loadAllImages() {
    this.$items.forEach($item => {
      const src = $item.attr('data-src');
      if (src) {
        $item.css('background-image', `url(${src})`);
        $item.removeAttr('data-src');
      }
    });
  }

  /**
   * Apply CSS styles to all elements
   */
  applyStyles() {
    // Item overlay styles
    this.$element.find('.pc-item-overlay').css({
      transition: 'opacity 0.3s ease-in-out',
      position: 'absolute',
      opacity: this.options.opacity,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: this.options.overlayColor
    });

    // Title styles
    this.$element.find('.pc-item-title').css({
      textTransform: 'none',
      fontSize: this.options.titleSize,
      fontWeight: 'bold',
      transition: 'bottom 0.3s ease-in-out',
      position: 'absolute',
      top: this.options.titleTop,
      left: 15,
      color: '#fff'
    });

    // Subtitle styles
    this.$element.find('.pc-item-subtitle').css({
      textTransform: 'none',
      fontSize: this.options.subtitleSize,
      fontWeight: 'normal',
      transition: 'bottom 0.3s ease-in-out',
      position: 'absolute',
      top: this.options.subtitleTop,
      left: 15,
      color: '#fff'
    });

    // Mask styles with gradient
    this.$element.find('.pc-item-mask').css({
      transition: 'opacity 0.2s 0.2s linear',
      position: 'absolute',
      opacity: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: this.options.maskHeight,
      width: '100%',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.61) 50%, rgba(0,0,0,0.61) 100%)'
    });
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    const { $ } = this;

    // Window resize
    $(window).on(`resize.${this.instanceId}`, this.handleResize);

    // Pause all on hover (entire container)
    if (this.options.pauseAllOnHover) {
      this.$element.on(`mouseenter.${this.instanceId}`, () => {
        this.pause();
      });
      this.$element.on(`mouseleave.${this.instanceId}`, () => {
        this.resume();
      });
    }

    // Hover events on items using delegation
    this.$element.on(`mouseenter.${this.instanceId}`, '.pc-item', (e) => {
      const $item = $(e.currentTarget);
      const $column = $item.parent();

      $item.find('.pc-item-overlay').css('opacity', 0);
      $item.find('.pc-item-mask').css({
        opacity: 1,
        transition: 'opacity 0.2s 0.2s linear'
      });

      // Stop single column/row on hover (if not using pauseAllOnHover)
      if (this.options.stopOnHover && !this.options.pauseAllOnHover) {
        $column.addClass('pc-col-active');
        this.activeColumn = $column.data('col-index');
      }
    });

    this.$element.on(`mouseleave.${this.instanceId}`, '.pc-item', (e) => {
      const $item = $(e.currentTarget);
      const $column = $item.parent();

      $item.find('.pc-item-overlay').css('opacity', this.options.opacity);
      $item.find('.pc-item-mask').css({
        opacity: 0,
        transition: 'opacity 0.2s linear'
      });

      if (this.options.stopOnHover && !this.options.pauseAllOnHover) {
        $column.removeClass('pc-col-active');
        this.activeColumn = null;
      }
    });
  }

  /**
   * Animation loop using requestAnimationFrame
   * @param {number} timestamp - Current timestamp
   */
  animate(timestamp) {
    if (!this.isAnimating || this.isPaused) return;

    const { $ } = this;

    // Calculate delta time for smooth animation
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta = timestamp - this.lastTimestamp;

    // Update at ~60fps (16.67ms per frame)
    if (delta >= 16) {
      this.lastTimestamp = timestamp;

      const direction = this.isReversed ? -1 : 1;
      const baseSpeed = this.options.animationSpeed * direction;

      if (this.options.variableSpeed) {
        // Variable speed: animate each column/row independently
        this.$columns.forEach(($col, i) => {
          const speed = baseSpeed * this.speedMultipliers[i];

          // Skip active column if stopOnHover is enabled
          if (this.options.stopOnHover && !this.options.pauseAllOnHover && this.activeColumn === i) {
            return;
          }

          this.columnOffsets[i] += speed;

          if (this.isHorizontal) {
            $col.css('transform', `translateX(${this.columnOffsets[i]}px)`);
          } else {
            $col.css('transform', `translateY(${this.columnOffsets[i]}px)`);
          }

          // Reset items that scroll out of view
          this.recycleItems($col, i);
        });
      } else {
        // Uniform speed: move container
        this.scrollOffset += baseSpeed;

        if (this.isHorizontal) {
          this.$container.css('transform', `translateX(${this.scrollOffset}px)`);
        } else {
          this.$container.css('transform', `translateY(${this.scrollOffset}px)`);
        }

        // Handle active column (stop on hover)
        if (this.options.stopOnHover && !this.options.pauseAllOnHover && this.activeColumn !== null) {
          const $activeCol = this.$columns[this.activeColumn];
          if ($activeCol) {
            const posAttr = this.isHorizontal ? 'data-left' : 'data-top';
            const transformProp = this.isHorizontal ? 'translateX' : 'translateY';

            $activeCol.find('.pc-item').each((_, item) => {
              const $item = $(item);
              const currentPos = parseFloat($item.attr(posAttr)) || 0;
              const newPos = currentPos - baseSpeed;
              $item.attr(posAttr, newPos);
              $item.css('transform', `${transformProp}(${newPos}px)`);
            });
          }
        }

        // Reset items that scroll out of view
        this.recycleAllItems();
      }
    }

    this.animationId = requestAnimationFrame(this.boundAnimate);
  }

  /**
   * Recycle items in a specific column/row (for variable speed)
   */
  recycleItems($col, colIndex) {
    const { $ } = this;
    const posAttr = this.isHorizontal ? 'data-left' : 'data-top';
    const transformProp = this.isHorizontal ? 'translateX' : 'translateY';
    const containerSize = this.isHorizontal ? this.$element.width() : this.options.height;
    const itemSize = this.isHorizontal ? this.options.colswidth : this.options.itemheight;
    const totalSize = (itemSize + this.options.gap) * (this.isHorizontal ? this.cols : this.rows);

    $col.find('.pc-item').each((_, item) => {
      const $item = $(item);
      const itemPos = parseFloat($item.attr(posAttr)) || 0;
      const absolutePos = this.columnOffsets[colIndex] + itemPos;

      if (this.isReversed) {
        // Scrolling down/right - recycle when item goes above/left of viewport
        if (absolutePos < -itemSize) {
          const newPos = itemPos + totalSize;
          $item.attr(posAttr, newPos);
          $item.css('transform', `${transformProp}(${newPos}px)`);
        }
      } else {
        // Scrolling up/left - recycle when item goes below/right of viewport
        if (absolutePos > containerSize) {
          const newPos = itemPos - totalSize;
          $item.attr(posAttr, newPos);
          $item.css('transform', `${transformProp}(${newPos}px)`);
        }
      }
    });
  }

  /**
   * Recycle all items (for uniform speed)
   */
  recycleAllItems() {
    const { $ } = this;
    const posAttr = this.isHorizontal ? 'data-left' : 'data-top';
    const transformProp = this.isHorizontal ? 'translateX' : 'translateY';
    const containerSize = this.isHorizontal ? this.$element.width() : this.options.height;
    const itemSize = this.isHorizontal ? this.options.colswidth : this.options.itemheight;
    const totalSize = (itemSize + this.options.gap) * (this.isHorizontal ? this.cols : this.rows);

    this.$items.forEach(($item) => {
      const itemPos = parseFloat($item.attr(posAttr)) || 0;
      const absolutePos = this.scrollOffset + itemPos;

      if (this.isReversed) {
        // Scrolling down/right
        if (absolutePos < -itemSize) {
          const newPos = itemPos + totalSize;
          $item.attr(posAttr, newPos);
          $item.css('transform', `${transformProp}(${newPos}px)`);
        }
      } else {
        // Scrolling up/left
        if (absolutePos > containerSize) {
          const newPos = itemPos - totalSize;
          $item.attr(posAttr, newPos);
          $item.css('transform', `${transformProp}(${newPos}px)`);
        }
      }
    });
  }

  /**
   * Pause the animation
   */
  pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume the animation
   */
  resume() {
    if (this.isPaused || !this.isAnimating) {
      this.isPaused = false;
      this.isAnimating = true;
      this.lastTimestamp = 0;
      this.animationId = requestAnimationFrame(this.boundAnimate);
    }
  }

  /**
   * Refresh the layout (on resize)
   */
  refresh() {
    const newCols = this.isHorizontal
      ? Math.floor(this.options.height / this.options.itemheight)
      : Math.floor(this.$element.width() / this.options.colswidth);

    const currentCount = this.isHorizontal ? this.rows : this.cols;

    if (newCols !== currentCount || newCols < 1) {
      this.pause();
      this.scrollOffset = 0;
      this.columnOffsets = [];

      // Disconnect observer before recreating layout
      if (this.imageObserver) {
        this.imageObserver.disconnect();
      }

      this.createLayout();

      // Re-setup lazy loading
      if (this.options.lazyLoad) {
        this.setupLazyLoading();
      }

      this.resume();
    }
  }

  /**
   * Destroy the plugin instance
   */
  destroy() {
    const { $ } = this;

    // Stop animation
    this.pause();
    this.isAnimating = false;

    // Disconnect IntersectionObserver
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }

    // Unbind events
    $(window).off(`resize.${this.instanceId}`);
    this.$element.off(`.${this.instanceId}`);

    // Clear DOM
    this.$element.empty();

    // Reset container styles
    this.$element.css({
      width: '',
      height: '',
      backgroundColor: '',
      overflow: '',
      position: ''
    });

    // Clear references
    this.$container = null;
    this.$columns = [];
    this.$items = [];
    this.$insetShadow = null;
    this.speedMultipliers = [];
    this.columnOffsets = [];

    // Remove from instances map
    instances.delete(this.element);
  }
}

/**
 * Initialize plugin on jQuery
 * @param {jQuery} $ - jQuery instance
 */
function initPlugin($) {
  if (!$ || !$.fn) {
    console.error('Photocols requires jQuery');
    return;
  }

  /**
   * jQuery plugin wrapper
   * @param {Object|string} optionsOrMethod - Options object or method name
   * @param {...*} args - Additional arguments for method calls
   * @returns {jQuery} jQuery object for chaining
   */
  $.fn.photocols = function(optionsOrMethod, ...args) {
    // Method call
    if (typeof optionsOrMethod === 'string') {
      const method = optionsOrMethod;
      return this.each(function() {
        const instance = instances.get(this);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        } else if (!instance) {
          console.warn(`Photocols: Cannot call method "${method}" before initialization`);
        } else {
          console.warn(`Photocols: Method "${method}" does not exist`);
        }
      });
    }

    // Initialization
    return this.each(function() {
      if (!instances.has(this)) {
        const instance = new Photocols($, this, optionsOrMethod);
        if (instance.options) {
          instances.set(this, instance);
        }
      }
    });
  };

  // Expose defaults for external modification
  $.fn.photocols.defaults = DEFAULTS;
}

// Auto-init for browser (UMD)
if (typeof window !== 'undefined' && window.jQuery) {
  initPlugin(window.jQuery);
}

// Export for ESM
export { Photocols, DEFAULTS, initPlugin };
export default initPlugin;

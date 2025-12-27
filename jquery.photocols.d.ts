/*!
 * Photocols v2.0.0 TypeScript Definitions
 * http://2coders.com
 * MIT License
 */

/**
 * Scroll direction for the gallery animation
 */
type PhotocolsDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Data item for a single photo in the gallery
 */
interface PhotocolsItem {
  /** Title text displayed on hover */
  title: string;
  /** Subtitle text displayed on hover */
  subtitle: string;
  /** URL to navigate to when clicked */
  url: string;
  /** Image URL for the photo */
  img: string;
}

/**
 * Configuration options for Photocols
 */
interface PhotocolsOptions {
  /** Background color of the container (default: '#000') */
  bgcolor?: string;
  /** Container width - number in pixels or 'auto' for 100% (default: 'auto') */
  width?: number | 'auto';
  /** Base width for calculating number of columns (default: 200) */
  colswidth?: number;
  /** Height of each photo item in pixels (default: 300) */
  itemheight?: number;
  /** Total height of the container in pixels (default: 600) */
  height?: number;
  /** Gap between items in pixels (default: 5) */
  gap?: number;
  /** Font size for titles in pixels (default: 16) */
  titleSize?: number;
  /** Font size for subtitles in pixels (default: 14) */
  subtitleSize?: number;
  /** Opacity of the overlay on photos, 0-1 (default: 0.3) */
  opacity?: number;
  /** Color of the overlay (default: '#000') */
  overlayColor?: string;
  /** Whether to pause animation when hovering over a column/row (default: true) */
  stopOnHover?: boolean;
  /** Array of photo items to display */
  data: PhotocolsItem[];
  /** Vertical position of the title from top of mask in pixels (default: 56) */
  titleTop?: number;
  /** Vertical position of the subtitle from top of mask in pixels (default: 80) */
  subtitleTop?: number;
  /** Height of the hover mask in pixels (default: 120) */
  maskHeight?: number;
  /** Animation speed in pixels per frame (default: 1) */
  animationSpeed?: number;
  /** Debounce delay for resize handler in milliseconds (default: 150) */
  debounceDelay?: number;

  // Direction options
  /** Scroll direction: 'up', 'down', 'left', or 'right' (default: 'up') */
  direction?: PhotocolsDirection;

  // Variable speed options
  /** Enable variable speed per column/row for parallax effect (default: false) */
  variableSpeed?: boolean;
  /** Speed variation range, 0.5 means 50% to 150% of base speed (default: 0.5) */
  speedVariation?: number;

  // Hover options
  /** Pause entire gallery on hover instead of just active column/row (default: false) */
  pauseAllOnHover?: boolean;

  // Lazy loading options
  /** Enable lazy loading of images with IntersectionObserver (default: false) */
  lazyLoad?: boolean;
  /** Pixels before viewport to start loading images (default: 100) */
  lazyLoadThreshold?: number;
  /** Background color shown while image loads (default: '#333') */
  placeholderColor?: string;
}

/**
 * Available method names for Photocols
 */
type PhotocolsMethod = 'destroy' | 'pause' | 'resume' | 'refresh';

/**
 * Photocols default options object
 */
interface PhotocolsDefaults extends Required<Omit<PhotocolsOptions, 'data'>> {
  data: PhotocolsItem[];
}

declare global {
  interface JQuery {
    /**
     * Initialize Photocols on the selected element(s)
     * @param options - Configuration options
     * @returns jQuery object for chaining
     * @example
     * $('#gallery').photocols({
     *   colswidth: 200,
     *   height: 500,
     *   data: [
     *     { title: 'Photo 1', subtitle: 'Description', url: '#', img: 'photo1.jpg' }
     *   ]
     * });
     */
    photocols(options: PhotocolsOptions): JQuery;

    /**
     * Call a method on Photocols instance(s)
     * @param method - Method name to call
     * @returns jQuery object for chaining
     * @example
     * $('#gallery').photocols('pause');
     * $('#gallery').photocols('resume');
     * $('#gallery').photocols('refresh');
     * $('#gallery').photocols('destroy');
     */
    photocols(method: PhotocolsMethod): JQuery;
  }

  interface JQueryStatic {
    fn: {
      photocols: {
        /** Default options that can be modified globally */
        defaults: PhotocolsDefaults;
      } & ((options: PhotocolsOptions) => JQuery) & ((method: PhotocolsMethod) => JQuery);
    };
  }
}

export { PhotocolsDirection, PhotocolsItem, PhotocolsOptions, PhotocolsMethod, PhotocolsDefaults };

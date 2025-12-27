# jquery.photocols.js

An animated photo gallery with scrolling columns and rows for jQuery. Supports vertical and horizontal scrolling with parallax effects.

Made by [2Coders Studio](http://2coders.com) in Canary Islands

## Features

- **Multi-directional scrolling** - Up, down, left, or right
- **Variable speed per column/row** - Create parallax effects
- **Lazy loading** - Images load only when entering viewport
- **Pause on hover** - Pause individual columns or entire gallery
- Hover effects with title/subtitle overlays
- Responsive layout that adapts to container width
- Multiple instance support
- TypeScript definitions included
- GPU-accelerated animations using CSS transforms
- Memory-safe with proper cleanup

## Installation

### npm

```bash
npm install jquery.photocols
```

### Direct Download

Download the minified file and include it in your page:

```html
<script src="jquery.photocols.min.js"></script>
```

### CDN

Via unpkg:
```html
<script src="https://unpkg.com/jquery.photocols@2.0.0/dist/jquery.photocols.min.js"></script>
```

Via jsDelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/jquery.photocols@2.0.0/dist/jquery.photocols.min.js"></script>
```

## Usage

Create a container element:

```html
<div id="photocols"></div>
```

Initialize the plugin with your photo data:

```javascript
$(document).ready(function() {
  $('#photocols').photocols({
    height: 500,
    colswidth: 200,
    data: [
      { title: 'Mountain View', subtitle: 'Nature', url: '#', img: 'https://picsum.photos/seed/a/640/480' },
      { title: 'City Lights',   subtitle: 'Urban',  url: '#', img: 'https://picsum.photos/seed/b/640/480' },
      { title: 'Ocean Waves',   subtitle: 'Coast',  url: '#', img: 'https://picsum.photos/seed/c/640/480' }
    ]
  });
});
```

## Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bgcolor` | CSS Color | `'#000'` | Background color of the container |
| `width` | Integer/String | `'auto'` | Container width (pixels or 'auto' for 100%) |
| `colswidth` | Integer | `200` | Base width for calculating column count |
| `itemheight` | Integer | `300` | Height of each photo item in pixels |
| `height` | Integer | `600` | Total container height in pixels |
| `gap` | Integer | `5` | Gap between items in pixels |
| `opacity` | Float (0-1) | `0.3` | Overlay opacity on photos |
| `titleSize` | Integer | `16` | Title font size in pixels |
| `subtitleSize` | Integer | `14` | Subtitle font size in pixels |
| `overlayColor` | CSS Color | `'#000'` | Color of the photo overlay |
| `stopOnHover` | Boolean | `true` | Pause column/row animation on hover |
| `data` | Array | `[]` | Array of photo item objects |
| `titleTop` | Integer | `56` | Title vertical position from top of mask |
| `subtitleTop` | Integer | `80` | Subtitle vertical position from top of mask |
| `maskHeight` | Integer | `120` | Height of the hover mask |
| `animationSpeed` | Integer | `1` | Animation speed in pixels per frame |
| `debounceDelay` | Integer | `150` | Resize debounce delay in milliseconds |

### Direction Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | String | `'up'` | Scroll direction: `'up'`, `'down'`, `'left'`, or `'right'` |

### Variable Speed Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variableSpeed` | Boolean | `false` | Enable variable speed per column/row for parallax effect |
| `speedVariation` | Float (0-1) | `0.5` | Speed variation range (0.5 = 50% to 150% of base speed) |

### Hover Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pauseAllOnHover` | Boolean | `false` | Pause entire gallery on hover (vs just active column/row) |

### Lazy Loading Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lazyLoad` | Boolean | `false` | Enable lazy loading of images with IntersectionObserver |
| `lazyLoadThreshold` | Integer | `100` | Pixels before viewport to start loading images |
| `placeholderColor` | CSS Color | `'#333'` | Background color shown while image loads |

## Data Format

Each item in the `data` array should have:

```javascript
{
  title: 'Photo Title',       // Title shown on hover
  subtitle: 'Photo Subtitle', // Subtitle shown on hover
  url: 'https://...',         // Link URL when clicked
  img: 'https://...'          // Image URL
}
```

## Examples

### Horizontal Scrolling (Left to Right)

```javascript
$('#gallery').photocols({
  direction: 'right',
  height: 400,
  data: myPhotos
});
```

### Parallax Effect with Variable Speed

```javascript
$('#gallery').photocols({
  variableSpeed: true,
  speedVariation: 0.6,  // 40% to 160% of base speed
  animationSpeed: 0.7,  // Slower for smooth parallax
  data: myPhotos
});
```

### Pause Entire Gallery on Hover

```javascript
$('#gallery').photocols({
  pauseAllOnHover: true,
  data: myPhotos
});
```

### Lazy Loading for Large Galleries

```javascript
$('#gallery').photocols({
  lazyLoad: true,
  lazyLoadThreshold: 150,
  placeholderColor: '#1a1a1a',
  data: myLargePhotoCollection
});
```

### Combined Features

```javascript
$('#gallery').photocols({
  direction: 'left',
  variableSpeed: true,
  speedVariation: 0.4,
  pauseAllOnHover: true,
  lazyLoad: true,
  height: 500,
  animationSpeed: 0.6,
  data: myPhotos
});
```

## Methods

### pause

Pause the animation:

```javascript
$('#photocols').photocols('pause');
```

### resume

Resume the animation:

```javascript
$('#photocols').photocols('resume');
```

### refresh

Rebuild the layout (useful after container resize):

```javascript
$('#photocols').photocols('refresh');
```

### destroy

Remove the plugin and clean up:

```javascript
$('#photocols').photocols('destroy');
```

## Global Defaults

You can modify the default options globally:

```javascript
$.fn.photocols.defaults.height = 800;
$.fn.photocols.defaults.animationSpeed = 2;
```

## TypeScript

TypeScript definitions are included. Import types if needed:

```typescript
import { PhotocolsOptions, PhotocolsItem } from 'jquery.photocols';

const options: PhotocolsOptions = {
  height: 500,
  data: [
    { title: 'Test', subtitle: 'Sub', url: '#', img: 'test.jpg' }
  ]
};

$('#gallery').photocols(options);
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires jQuery 1.7 or higher.

## Development

```bash
# Install dependencies
npm install

# Build minified version
npm run build
```

## Changelog

### v2.0.0

- **Breaking**: Requires ES6-compatible browser (or transpilation)
- **Security**: Fixed XSS vulnerability in title/subtitle rendering
- **Performance**: Replaced setTimeout with requestAnimationFrame
- **Performance**: Uses CSS transforms for GPU-accelerated animation
- **Performance**: Added resize debouncing
- **Feature**: Multiple instance support
- **Feature**: Added `pause()`, `resume()`, `refresh()`, `destroy()` methods
- **Feature**: TypeScript definitions included
- **Feature**: New configurable options: `titleTop`, `subtitleTop`, `maskHeight`, `animationSpeed`, `debounceDelay`
- **Feature**: Scroll direction support (`up`, `down`, `left`, `right`)
- **Feature**: Variable speed per column/row for parallax effects
- **Feature**: Pause entire gallery on hover option
- **Feature**: Lazy loading with IntersectionObserver
- **Feature**: New options: `direction`, `variableSpeed`, `speedVariation`, `pauseAllOnHover`, `lazyLoad`, `lazyLoadThreshold`, `placeholderColor`
- **Fix**: Global variable leak
- **Fix**: Memory leak on resize/destroy
- **Fix**: CSS `text-transformation` typo (now `text-transform`)
- **Build**: Migrated from Grunt to npm scripts with Terser

### v1.0.3

- Initial stable release

## License

MIT License - see [LICENSE](LICENSE) for details.

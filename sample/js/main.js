// Sample photo data
var data = [
  { title: 'Mountain View',   subtitle: 'Nature Photography',   url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo1/640/480' },
  { title: 'City Lights',     subtitle: 'Urban Landscape',      url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo2/640/480' },
  { title: 'Ocean Waves',     subtitle: 'Coastal Beauty',       url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo3/640/480' },
  { title: 'Forest Path',     subtitle: 'Woodland Adventure',   url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo4/640/480' },
  { title: 'Desert Sunset',   subtitle: 'Golden Hour',          url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo5/640/480' },
  { title: 'Snowy Peaks',     subtitle: 'Winter Wonderland',    url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo6/640/480' },
  { title: 'Autumn Leaves',   subtitle: 'Fall Colors',          url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo7/640/480' },
  { title: 'Starry Night',    subtitle: 'Night Sky',            url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo8/640/480' },
  { title: 'Flower Garden',   subtitle: 'Spring Blooms',        url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo9/640/480' },
  { title: 'River Valley',    subtitle: 'Peaceful Waters',      url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo10/640/480' },
  { title: 'Canyon Vista',    subtitle: 'Desert Majesty',       url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo11/640/480' },
  { title: 'Tropical Beach',  subtitle: 'Paradise Found',       url: 'http://www.2coders.com', img: 'https://picsum.photos/seed/photo12/640/480' },
];

$(function() {
  // Basic Example (default - scroll up)
  $('#gallery-basic').photocols({
    colswidth: 200,
    height: 400,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Direction: Up
  $('#gallery-up').photocols({
    direction: 'up',
    colswidth: 180,
    height: 300,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Direction: Down
  $('#gallery-down').photocols({
    direction: 'down',
    colswidth: 180,
    height: 300,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Direction: Left (horizontal)
  $('#gallery-left').photocols({
    direction: 'left',
    colswidth: 200,
    height: 300,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Direction: Right (horizontal)
  $('#gallery-right').photocols({
    direction: 'right',
    colswidth: 200,
    height: 300,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Variable Speed (Parallax Effect)
  $('#gallery-parallax').photocols({
    variableSpeed: true,
    speedVariation: 0.6,
    animationSpeed: 0.7,
    colswidth: 200,
    height: 400,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Pause All on Hover
  $('#gallery-pause-all').photocols({
    pauseAllOnHover: true,
    colswidth: 200,
    height: 400,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Lazy Loading
  $('#gallery-lazy').photocols({
    lazyLoad: true,
    lazyLoadThreshold: 150,
    placeholderColor: '#2d2d44',
    colswidth: 200,
    height: 400,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Combined Features
  $('#gallery-combined').photocols({
    direction: 'left',
    variableSpeed: true,
    speedVariation: 0.5,
    pauseAllOnHover: true,
    lazyLoad: true,
    lazyLoadThreshold: 100,
    animationSpeed: 0.6,
    colswidth: 220,
    height: 450,
    bgcolor: '#1a1a2e',
    opacity: 0.4,
    gap: 3,
    data: data
  });

  // Custom Styling
  $('#gallery-styled').photocols({
    bgcolor: '#0a192f',
    overlayColor: '#0a192f',
    opacity: 0.5,
    titleSize: 18,
    subtitleSize: 14,
    gap: 4,
    colswidth: 200,
    height: 400,
    data: data
  });
});

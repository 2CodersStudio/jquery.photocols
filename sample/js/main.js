var data = [
  { 'title' : 'Title 1' ,  'subtitle' : 'Subtitle 1' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/1' },
  { 'title' : 'Title 2' ,  'subtitle' : 'Subtitle 2' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/2' },
  { 'title' : 'Title 3' ,  'subtitle' : 'Subtitle 3' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/3' },
  { 'title' : 'Title 4' ,  'subtitle' : 'Subtitle 4' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/4' },
  { 'title' : 'Title 5' ,  'subtitle' : 'Subtitle 5' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/5' },
  { 'title' : 'Title 6' ,  'subtitle' : 'Subtitle 6' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/6' },
  { 'title' : 'Title 7' ,  'subtitle' : 'Subtitle 7' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/7' },
  { 'title' : 'Title 8' ,  'subtitle' : 'Subtitle 8' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/8' },
  { 'title' : 'Title 9' ,  'subtitle' : 'Subtitle 9' ,  'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/9' },
  { 'title' : 'Title 10' , 'subtitle' : 'Subtitle 10' , 'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/10' },
];

(function ( $ ) {

  $('#photocols').photocols({
    colswidth : 200,
    height : 440,
    bgcolor : '#fff',
    opacity: 0.6,
    gap: 2,
    data: data});

}( jQuery ));

# jquery.photocols.js

Made by <a href='http://2coders.com'>2Coders Studio</a> in Canary Islands

## How to Use It

Download the minified file of this plugin.

You have to include this line into your page header:

```html
    <script type="text/javascript" src="jquery.photocols.min.js"></script>
```

Or use the CDN version at www.cdnjs.com:

```html
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.photocols/1.0.2/jquery.photocols.min.js"></script>
```

Then create a div to contain the photocols navigation

```html
    <div id="photocols"></div>
```

Bind the plugin to the tag:

```html
<script type="text/javascript">

jQuery( document ).ready(function( $ ) {
  $('#photocols').photocols( {
      data : [
        { 'title' : 'Title 1' , 'subtitle' : 'Subtitle 1' , 'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/1' },
        { 'title' : 'Title 2' , 'subtitle' : 'Subtitle 2' , 'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/2' },
      ]
    });
});

</script>
```

## Parameters

You can customize the aspect of the plugin using this options:

Options | Type | Default  
--- | --- | ---
bgcolor       | CSS Color     | '#000',
width		      | Integer       | 'auto',
colswidth     | Integer       | 200,
itemheight    | Integer       | 300,
height		    | Integer       | 600,
gap           | Integer       | 5,
opacity       | Float (0..1)  | 0.3
titleSize     | Pixels        | 16
subtitleSize  | Pixels        | 14
overlayColor  | CSS Color     | '#000'
stopOnHover   | Boolean       | true

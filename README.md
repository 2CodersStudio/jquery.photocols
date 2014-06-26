# jquery.photocols.js

<a href='http://2coders.com'>jquery.photocols.js</a>

## How to Use It

You have to include this line into your page header

    <script type="text/javascript" src="jquery.photocols.min.js"></script>

Then create a div to cantain the photocols navigation

    <div id="photocols"></div>

Bind the plugin to the tag:

    jquery('#photocols').photocols( {
        data : [
          { 'title' : 'Title 1' , 'subtitle' : 'Lorem ipsum' , 'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/1' },
          { 'title' : 'Title 2' , 'subtitle' : 'Lorem ipsum' , 'url' : 'http://www.2coders.com' , 'img' :  'http://lorempixel.com/640/480/people/2' },
        ]
      });

You can customize the aspect of the plugin using this options:

Options | Type | Default  
--- | --- | ---
bgcolor       | CSS Color     | '#000',
width		     | Integer       | 'auto',
colswidth     | Integer       | 200,
itemheight    | Integer       | 300,
height		    | Integer       | 600,
gap           | Integer       | 5,
opacity       | Float (0..1)  | 0.3
titleSize     | Pixels        | 16
subtitleSize  | Pixels        | 14
overlayColor  | CSS Color     | '#000'
stopOnHover   | Boolean       | true

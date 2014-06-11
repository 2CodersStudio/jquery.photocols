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

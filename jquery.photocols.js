/*!
 * Photocols v0.0
 * Photo navigation moving cols
 * http://2coders.com
 * MIT License
 * by 2Coders Studio
 */

(function( $ ){
	$.fn.photocols = function(options) {

    element = this;

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
      bgcolor   : '#000',
      width		 : 'auto',
      colswidth : '200',
			height		: 600,
      gap       : 5,
      opacity   : 0.3,
      data      : {}
		}, options);


    var animate = function ( item ) {
      $( item ).animate({
        top: parseInt($(item).position().top + (options.height/2+options.gap)*4)
      }, {
        duration: 80000,
        easing: "linear",
        complete: function() {
          animate( this );
        },
        step: function( now, fx ) {
          if ( now  > options.height ) {
							$(fx.elem).stop();
              $(fx.elem).css('top', parseInt($(fx.elem).position().top - (options.height/2+options.gap)*4)) ;
							animate( fx.elem );

          }
        }
      });
    };

    var resize = function () {

			$.fx.off = true;

      element.children().remove();

			$.fx.off = false;

      var cols = Math.floor( element.width() / ( options.colswidth ) );
      var gapX = Math.floor(element.width() / cols) - options.colswidth ;

      var count= 0;

      for ( var i= 0 ; i < cols ; i++) {

        var leftposition = element.width() / cols ;
        var topposition = parseInt(Math.random()*options.height);

        var col = $('<div id="pc-col'+i+'" class="pc-col" style="position:absolute" />');

        element.append(col);

        for ( var j= 0 ; j < 4 ; j++) {

          var item = options.data[count++ % options.data.length];

              col.append( '<a class="pc-item" href="'+item.url+'" style="background-image:url(' + item.img +
                              ');left:'+ (leftposition*i + gapX/2) +'px;top:'+(topposition + (options.height/2 +options.gap )*j)+
                           'px" ><div class="pc-item-mask"><span class="pc-item-title" >'+item.title+'</span><span class="pc-item-subtitle">'+item.subtitle+'</span></div></a>');
        };

      };

      init();

    };

    var init = function () {

      element.css('width', options.width == 'auto' ? '100%' : options.width );
      element.css('height', options.height );
      element.css('background-color', options.bgcolor);
      element.css('overflow', 'hidden');
      element.css('position', 'relative');

      style();

      $('.pc-item').hover(function( e ){

        if ( e.type === "mouseenter" ) {
          $(this).css( {
            'opacity'         : 1,
            '-webkit-filter'  : "saturate(100%)",
            'filter'          : "saturate(100%)",
            'filter'          : "none"
          });
          $(this).find('.pc-item-mask').css('bottom', 0);


        } else {
          $(this).css( {
            'opacity'         : options.opacity,
            '-webkit-filter'  : "saturate(40%)",
            'filter'          : "saturate(40%)",
            //mozilla trick
            'filter'          : 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale")',
          });
          $(this).find('.pc-item-mask').css('bottom', -60);


        }

      });



      $('.pc-item').each( function (index) {
          animate(this);
      });

    };

    var style = function () {
      $('.pc-item').css({
        'transition'      : 'opacity 0.3s linear',
        'opacity'         : options.opacity,
        'overflow'        : 'hidden',
        'position'        : 'absolute',
        'background-size' : 'cover',
        '-webkit-filter'  : 'saturate(40%)',
        'filter'          : 'saturate(40%)',
        //mozilla trick
        'filter'          : 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale")',
        'width'           : options.colswidth,
        'height'          : options.height/2,
      });

      $('.pc-item-title').css({
        'text-transformation' : 'none',
        'font-weight'         : 'bold',
        'transition'          : 'bottom 0.3s ease-in-out',
        'position'            : 'absolute',
        'top'              : 10,
        'left'                : 10,
        'color'               : '#fff'
      });

      $('.pc-item-subtitle').css({
        'text-transformation' : 'none',
        'font-weight'         : 'normal',
        'transition'          : 'bottom 0.3s ease-in-out',
        'position'            : 'absolute',
        'top'                 : 30,
        'left'                : 10,
        'color'               : '#fff'
      });



      $('.pc-item-mask').css({
        'transition'          : 'bottom 0.3s ease-in-out',
        'position'            : 'absolute',
        'bottom'              : '-100px',
        'left'                : 0,
        'right'               : 0,
        'height'              : 60,
        'background-color'    : 'rgba(0,0,0,0.6)'
      });

    };


    $( window ).resize (resize);

    resize();

    return element;

	};
})( jQuery );

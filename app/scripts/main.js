/* jshint devel:true */

/* 
Структура слайдера:
<div> --контейнер с классом/ид
    <div> --обертка окна показа слайдов. Если ее нет ширирна считается от контейнера
        <ul class="slider__wrapper"> --простенький список
            <li> --любое содержимое
        </ul>
    </div>
    .nav nav--prev --навигация
    .nav nav--next
    .slider__input --счетчик слайдов
</div>
 */


'use strict';

if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document, undefined) {

    var Slider = {
        init: function (options, elem) {

            var self = this;
            var swither, wrapper, cnt;

            self.maxScrollPosition = 0;
            self.elem = elem;

            self.options = $.extend({}, $.fn.sliderShop.options, options);

            this.wrapper = $(this.elem).find('.slider__wrapper');
            this.swither = this.wrapper.children().addClass('swither__item'); 
            this.cnt = this.wrapper.find('.swither__item').length

            self.calcConst();

            $(this.elem).find('.nav').on('click', function (e) {
                e.preventDefault();

                var $targetItem = $(elem).find('.swither__item--edge');

                $(this).hasClass('nav--prev') 
                    ? self.toGalleryItem($targetItem.prev())
                    : self.toGalleryItem($targetItem.next());
            });

            if (this.options.timer) {
                setInterval(function () {

                var $targetItem = $(elem).find('.swither__item--edge');
                    
                    self.toGalleryItem($targetItem.next());
                },this.options.timer)
            }
        },

        calcConst: function () {
            var self = this,
                totalWidth = 0,
                section = $(this.elem).outerWidth() - 40,
                space = this.wrapper.parent().width() - this.swither.outerWidth(true)*this.options.caseLimit,
                elspace =(this.options.spaceSection === 'auto') 
                                                ? space / (this.options.caseLimit * 2) 
                                                : this.options.spaceSection;

                elspace = ( space < 0 ) ? 0 : elspace;

                this.swither
                    .css({
                        'margin-left': elspace,
                        'margin-right': elspace
                    })
                    .each(function() {
                        totalWidth = totalWidth + $(this).outerWidth(true);
                    });

            if (this.options.count == 1) {
                $(this.elem).find('.slider__input').text('1 / ' + this.swither.length)
            }

            self.maxScrollPosition = totalWidth - this.swither.outerWidth(true) * this.options.caseLimit;

            this.wrapper.width(totalWidth + 20);

            this.swither.first().addClass('swither__item--edge');
        },

        toGalleryItem:  function ($targetItem) {
            var self = this;

            if($targetItem.length) {

                var newPosition = $targetItem.position().left;

                if(newPosition <= self.maxScrollPosition+2) {

                    $targetItem.addClass('swither__item--edge');
                    $targetItem.siblings().removeClass('swither__item--edge');

                    if (this.options.count == 1) {
                        $(this.elem).find('.slider__input')
                            .text($targetItem.prevAll().length + this.options.caseLimit + ' / ' + this.swither.length)
                    }

                    switch (this.options.animation) {

                        case 'slide':
                            this.wrapper.animate({left : - newPosition});
                            break;

                        case 'hide-show':
                            this.wrapper.css({
                                'opacity' : '0',
                                'left' : - newPosition
                            }) 
                            .animate({opacity : 1});
                            break; 
                    } 
                }
                else if(this.options.repeat) {
                    if(!this.swither) {return}
                
                    var first = this.swither.removeClass('swither__item--edge').first().addClass('swither__item--edge')
                    self.toGalleryItem(first)
               
                }

            } else if(this.options.repeat) {
                if(!this.swither) {return}
                
                var first = this.swither.removeClass('swither__item--edge').first().addClass('swither__item--edge')
                self.toGalleryItem(first)
               
            }
        } 
    };

    

    $.fn.sliderShop = function (options) {
        return this.each(function() {
            
            var slider = Object.create( Slider );
            slider.init( options, this );
        });

    }; 

   $.fn.sliderShop.options = {
        caseLimit: 4, //кол-во товаров в витрине
        spaceSection: 'auto', //расстояние между секциями
        animation: 'slide', //тип анимации
        count: false, // счетчик слайдов
        timer: false, //автопереключение
        repeat: false //показ слайдов по кругу
    };

    (function() {
    $('dd').filter(':nth-child(n+4)').addClass('hide');

    $('dl').on('click', 'dt', function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active')
                .next()
                    .slideUp(300);
            return
        }

        $(this)
            .siblings('dt')
                .removeClass('active');

        $(this)
            .addClass('active')
                .next()
                    .slideDown(300)
                        .siblings('dd')
                            .slideUp(300);
    
    })
})();

})( jQuery, window, document );

/*
 * jQuery liLanding v 1.0
 *
 * Copyright 2013, Linnik Yura | LI MASS CODE | http://masscode.ru
 * Free to use
 *
 * 03.12.2013
 */
(function ($) {
    var methods = {
        init: function (options) {
            var p = {
                show: function (linkEl, landingItem) {}, 
                hide: function (linkEl, landingItem) {}
            };
            if (options) {
                $.extend(p, options);
            }
            return this.each(function () {
                var el = $(this);
                var elPos = el.offset().top;
                var wHalf = $(window).height()/2
                var scrollId = function(){};
                
                //assign events only links with anchors
                $('a[href^=#]',el).on('click',function(){
                    var linkItem = $(this);
                    if(!linkItem.is('.cur')){
                        var linkHref = linkItem.attr('href');
                        var linkTarget = $(linkHref);
                        var linkTargetPos = linkTarget.offset().top;
                        var windowPos = $(window).scrollTop();
                        var animDuration = linkTargetPos - windowPos
                        if(animDuration < 0){
                            animDuration = animDuration*-1  
                        }
                        //scroll the page to the desired block
                        if(linkTarget.length){
                            $('html, body').stop(true).animate({scrollTop:linkTargetPos},animDuration,function(){
                                $(window).trigger('scroll');
                            });
                        }
                    }
                    return false;
                })
                //stop the animation by scrolling
                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
                if (document.attachEvent) //if IE (and Opera depending on user setting)
                    document.attachEvent("on"+mousewheelevt, function(e){
                        $('html, body').stop(true);     
                    });
                else if (document.addEventListener) //WC3 browsers
                    document.addEventListener(mousewheelevt, function(e){
                        //e.detail //direction
                        $('html, body').stop(true);
                    }, false)
                //highlight the desired link in the menu by scrolling
                $(window).on('scroll',function(e){
                    clearTimeout(scrollId);
                    var windowPos = $(window).scrollTop();
                    if(windowPos > elPos){
                        el.addClass('landingFix');  
                    }else{
                        el.removeClass('landingFix');   
                    }
                    scrollId = setTimeout(function(){
                        $('.landingItem').each(function(){
                            var landingItem = $(this);
                            var landingItemHeight = landingItem.height();
                            var landingItemTop = landingItem.offset().top - wHalf;
                            var linkHref = landingItem.attr('id');
                            var linkEl = $('a[href="#'+linkHref+'"]',el);
                            var status;


                            if(windowPos > landingItemTop && windowPos < (landingItemTop + landingItemHeight)){
                                if(!linkEl.is('.cur')){
                                    linkEl.addClass('cur');
                                    if (p.show !== undefined) {
                                        p.show(linkEl, landingItem);
                                    }
                                }
                            }else{
                                if(linkEl.is('.cur')){
                                    linkEl.removeClass('cur');
                                    if (p.hide !== undefined) {
                                        p.hide(linkEl, landingItem);
                                    }
                                }
                            }
                        });
                    },100);
                })
                $(window).trigger('scroll');
            });
        }
    };
    $.fn.liLanding = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод ' + method + ' в jQuery.liLanding не существует');
        }
    };
})(jQuery);

;(function popup () {
    $('.popup__link').on('click', function (e) {
        e.preventDefault();
        var winHeight = $(document).height(),
        elem = $('.' + $(this).data('popup'))

        elem.css('height', winHeight).fadeIn(400);

        var top = ($(window).height() - elem.children('div').outerHeight(true)) / 2;

        elem.children('div').animate({'top' : top >= 0 ? top : 0}, 400);

        if(elem.children('div').outerHeight(true) > $(window).height()) {
            elem.children('div').css({
                'height': $(window).height(),
                'overflow-y': 'scroll'
            });
        }
    });

    $('.popup__close, .p__close').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.popup').fadeOut(400).children('div').css({
            'height': 'auto',
            'overflow-y': 'hidden'
        });
    })
})();

/**
 * @author Leechy (leechy@leechy.ru)
 * @link www.artlebedev.ru
 * @requires jQuery
 *
 * Description:
 * gradientText is a jQuery plugin that paints text in gradient colors
 *
 * Usage:
 * $(selector).gradientText(config);
 *
 * config is an object contents configuraton paramenters:
 *  {Array} colors - array of hex colors, e.g. ['#000000', '#FFFFFF'];
 *  {Array} toProcess - array of jQuery selectors, matched elements will be toProcessed
 */

(function($){
    // Параметры по умолчанию
    $.gradientText = $.gradientText || {version: '1.0'};

    $.gradientText.conf = {
        colors: ['#5f3db6', '#c10000'],
        toProcess: []
    };

    $.gradientTextSetup = function(conf) {
        $.extend($.gradientText.conf, conf);
    };

    $.fn.gradientText = function(conf) {
        
        // already constructed --> return API
        var el = this.data("gradientText");
        if (el) { return el; }
                
        // concatinate defined conf object with the user's one
        if (!conf) {
            conf = $.gradientText.conf;
        } else {
            if (typeof(conf.colors) == 'undefined') {
                conf.colors = $.gradientText.conf.colors;
            }
        }

        var aLetters = [];

        this.each(function(i) {
            aLetters[i] = new GradientLetters($(this), conf);
            $(this).data("gradientText", aLetters[i]);  
        });
        
        $(window).load(function() {
            var iLetters_amount = aLetters.length;
            for (var i = 0; i < iLetters_amount; i++) {
                aLetters[i].update();
            }
        });

        return conf.api ? el: this; 
    };


    function GradientLetters(jContainer, conf) {
        /**
         *  Если плагин уже поработал над элементом,
         *  то заново дробить его не нужно
         */
        if (jContainer.find('span.gr-text').size() == 0) {
            /**
             *  getting nodes, good enough
             *  to be spliced in letters
             */
            var jTextNodes = jContainer.contents().filter(function() {
                return (this.nodeType == 3 && /\S/.test(this.nodeValue))
            }).wrap('<span class="gr-text" />');

            if (typeof(conf.toProcess) != 'undefined') {
                var tags = conf.toProcess.toString();

                if (tags) {
                    jTextNodes = jContainer.find(tags).contents().filter(function() {
                        return (this.nodeType == 3 && /\S/.test(this.nodeValue))
                    }).wrap('<span class="gr-text" />');
                }
            }

            /**
             *  width of the content can be less than jContainer's width
             *  that's why we have to use inline wrapper like span
             */
            jContainer.html('<span class="gr-wrap">' + jContainer.html() + '</span>');
            jContainer = jContainer.find('.gr-wrap');

            /**
            *   Оборачиваем каждую букву в span.gr-letter.
            *   Пробелы заменяем на пробел нулевой ширины
            */
            jContainer.find('span.gr-text').each(function(){
                var aText = $(this).text().split('');
                var sHTML = '';
                var iText_amount = aText.length;

                for (var i = 0; i < iText_amount; i++) {
                    if (aText[i] != ' ') {
                        sHTML += '<span class="gr-letter">' + aText[i] + '</span>';
                    } else {
                        sHTML += '<span class="gr-letter"><span style="display:none;">&#8203;</span> </span>';
                    }
                }
                $(this).html(sHTML);
            });
        }

        var jWords = jContainer.find('span.gr-text');
        var jLetters = jContainer.find('span.gr-letter');
        var iHeight = 0;

        // Convert defined hex colors to rgb-colors
        conf.RGBcolors = [];
        for (var i = 0; i < conf.colors.length; i++) conf.RGBcolors[i] = hex2Rgb(conf.colors[i]);

        /**
         *  Measurer — некий объект, который понимает не только когда изменяется ширина окна,
         *  но и когда меняется размер шрифта.
         *
         *  Плагин использует:
         *  - jcommon, если он есть;
         *  - measurer, если нет jcommon и подключен файл с measurer,
         *  - resize, если по какой-то причине ни того, ни другого не обнаружено.
         */
        if (typeof($c) != 'undefined') $c.measurer.bind(updateColors);
        else if (typeof($measurer) != 'undefined') $measurer.bind(updateColors);
        else $(window).resize(updateColors);

        PaintUnderlines();

        function updateColors() {
            var iRootLeftOffset = Math.round(jContainer[0].offsetLeft),
                iRootWidth = getMaxRootWidth(iRootLeftOffset),
                jLetters_amount = jLetters.size();

            if (iRootWidth < 200) iRootWidth = 200;

            for( var i = jLetters_amount; i--; ) {
                jLetters[i].style.color = getColor(Math.round(jLetters[i].offsetLeft - iRootLeftOffset), iRootWidth);
            }
        }

        function getMaxRootWidth(iRootLeftOffset) {
            var iMaxWidth = 0;
            jWords.each(function(index) {
                var iRightEdge = Math.round(this.offsetWidth + this.offsetLeft) - iRootLeftOffset;
                if (iRightEdge > iMaxWidth) iMaxWidth = iRightEdge;
            });
            return iMaxWidth;
        }

        function getColor(iLeftOffset, iRootWidth) {
            var
                fLeft = (iLeftOffset > 0)? (iLeftOffset / iRootWidth) : 0;
            for (var i = 0; i < conf.colors.length; i++) {
                fStopPosition = (i / (conf.colors.length - 1));
                fLastPosition = (i > 0)? ((i - 1) / (conf.colors.length - 1)) : 0;

                if (fLeft == fStopPosition) {
                    return conf.colors[i];
                } else if (fLeft < fStopPosition) {
                    fCurrentStop = (fLeft - fLastPosition) / (fStopPosition - fLastPosition);
                    return getMidColor(conf.RGBcolors[i-1], conf.RGBcolors[i], fCurrentStop);
                }
            }
            return conf.colors[conf.colors.length - 1];
        }

        function getMidColor(aStart, aEnd, fMidStop) {
            var aRGBColor = [];

            for (var i = 0; i < 3; i++) {
                aRGBColor[i] = aStart[i] + Math.round((aEnd[i] - aStart[i]) * fMidStop)
            }

            return rgb2Hex(aRGBColor)
        }


        /**
        * To paint underline of gradiented text in right colors
        * every .gr-letter element has to have css rule:
        *   text-decoration: underline;
        * so this function searching for .gr-text that is child
        * of underlined element
        */
        function PaintUnderlines () {
            /* When gradiented element contains underlined child */
            jContainer.find('.gr-text').each(function(){
                if ($(this).parent().css('text-decoration') == 'underline') {
                    $(this).parent().find('.gr-letter').css('text-decoration', 'underline');
                }
            });

            /* When gradiented element is underlined */
            if (jContainer.parent().css('text-decoration') == 'underline') {
                jContainer.find('.gr-letter').css('text-decoration', 'underline');
            }
        }

        return {
            update: updateColors
        }
    }

    /**
     * Преобразует HEX-представление цвета в RGB.
     * @param {String} hex
     * @return {Array}
     */
    function hex2Rgb(hex) {
        if ('#' == hex.substr(0, 1)) {
            hex = hex.substr(1);
        }
        if (3 == hex.length) {
            hex = hex.substr(0, 1) + hex.substr(0, 1) + hex.substr(1, 1) + hex.substr(1, 1) + hex.substr(2, 1) + hex.substr(2, 1);
        }

        return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
    }

    /**
     * Преобразует RGB-представление цвета в HEX.
     * @param {Array} rgb
     * @return {String}
     */
    function rgb2Hex(rgb) {
        var s = '0123456789abcdef';

        return '#' + s.charAt(parseInt(rgb[0] / 16)) + s.charAt(rgb[0] % 16) + s.charAt(parseInt(rgb[1] / 16)) +
            s.charAt(rgb[1] % 16) + s.charAt(parseInt(rgb[2] / 16)) + s.charAt(rgb[2] % 16);
    }
})( jQuery );


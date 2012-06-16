(function($) {
    $.fn.externCarousel = function() {

        this.find("br").remove();

        var contents = "";
        contents += "<span id='carouselPrev'></span>";// $('<span>', {id:'carouselPrev'});
        contents += "<span id='carouselNext'></span>";
        contents += "<div id='carouselContents'>";
        contents += "<span id='carouselScrollerBack'></span>";
        contents += "<ul id='carouselContentsList'>";
        this.children().each(function(index) {
            $(this).hide();
            $(this).attr("data-index", index)
            var title = $($(this).children()[0]).html();
            contents += ("<li data-index=" + index + "><a href='javascript:void(0);'>" + title + "</a></li>");
        });
        contents += "</ul>";
        contents += "<span id='carouselScrollerForward'></span>";
        contents += "</div>";

        this.append(contents);

        var $carousel = this;
        var $carouselContents = $("div#carouselContents");
        var $carouselContentsList = $("ul#carouselContentsList");
        var $carouselContentsListItems = $("ul#carouselContentsList li");
        var $carouselScrollerBack = $("span#carouselScrollerBack");
        var $carouselScrollerForward = $("span#carouselScrollerForward");
        var $carouselPrev = $("span#carouselPrev");
        var $carouselNext = $("span#carouselNext");
        var scrollerWidth = this.width() / 20;
        var scrollPixels = 1;
        var scrollInterval = 10;

        $carouselContentsList.children().each(function(index) {
            $(this).click(function() {
                showArticle($(this).attr("data-index"));
            });
        });

        $carousel.css({
            "position": "relative",
            "overflow": "hidden"
        });

        $carouselContents.css({
            "position": "relative",
            "overflow": "hidden",
            "width": this.width()
        });

        $carouselContentsList.css({
            "width": calculateContentsWidth() + "px",
            "position": "relative",
            "top": 0,
            "left": scrollerWidth/2 + "px",
            "text-align": "center"
        });

        $carouselContentsListItems.css({
            "display": "inline-block"
        });

        if ($.browser.msie) {
            $carouselContentsListItems.css({
                "display": "inline",
                "zoom": 1
            });
        }

        $carouselScrollerBack.css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": scrollerWidth,
            "z-index": 100
        });

        $carouselScrollerForward.css({
            "position": "absolute",
            "top": 0,
            "left": (this.width() - scrollerWidth + 1),
            "width": scrollerWidth,
            "z-index": 100
        });

        showArticle(totalArticles() - 1);
        showActiveTimelineItem(totalArticles() - 1);
        $carouselNext.disableSelection();
        $carouselPrev.disableSelection();

        function totalArticles() {
            var total = 0;
            $carousel.children().each(function() {
                if ($(this).attr("data-index")) {
                    total += 1;
                }
            });
            return total;
        }

        function calculateContentsWidth() {
            var width = 0;
            $carouselContentsList.children().each(function() {
                width += $(this).outerWidth(true);
            });
            if (width < $carousel.width())
                return $carousel.width();
            else
                return width;
        }

        function showArticle(index) {
            index = parseInt(index);
            if (index >= 0 && index < totalArticles()) {
                $carousel.children().each(function() {
                    var dataIndex = parseInt($(this).attr("data-index"));
                    if (index == dataIndex) {
                        $(this).show();
                        $(this).children().each(function() {
                            $(this).hide();
                            $(this).fadeIn("slow");
                        });
                    } else if (!isNaN(dataIndex)) {
                        $(this).hide();
                    }
                });
                $carouselContentsListItems.each(function() {
                    var dataIndex = parseInt($(this).attr("data-index"));
                    if (index == dataIndex) {
                        $(this).addClass("active");
                    } else if (!isNaN(dataIndex)) {
                        $(this).removeClass("active");
                    }
                });
                $carousel.attr("currentArticle", index);
            }
            controlNavigateButtons(index);
        }

        function controlNavigateButtons(index) {
            if (index >= totalArticles() - 1) {
                $carouselNext.hide();
            } else {
                $carouselNext.show();
            }
            if (index <= 0) {
                $carouselPrev.hide();
            } else {
                $carouselPrev.show();
            }
        }

        function scrollCarouselContentsList(positionInterval) {
            $.scrollerIntervalId = setInterval(function() {
                var leftPosition = parseInt($carouselContentsList.css("left"));
                var minRange = - calculateContentsWidth() + $carousel.width() - scrollerWidth / 2;
                var maxRange = 0 + scrollerWidth / 2;
                if (leftPosition + positionInterval > minRange && leftPosition + positionInterval < maxRange) {
                    $carouselContentsList.css("left", (leftPosition + positionInterval) + "px");
                }
            }, scrollInterval);
        }

        function stopScrollCarouselContentsList() {
            clearInterval($.scrollerIntervalId);
        }

        function navigateArticles(directionIndex) {
            var currentArticle = parseInt($carousel.attr("currentArticle"));
            showArticle(currentArticle + directionIndex);
            showActiveTimelineItem(currentArticle + directionIndex);
        }

        function showActiveTimelineItem(index) {
            var beginShift = scrollerWidth/2;
            var itemWidth = $($carouselContentsListItems[0]).outerWidth();
            var pixelsToLeft = beginShift - itemWidth * index + $carouselContents.width()/2 - itemWidth;
            $carouselContentsList.css("left", pixelsToLeft + "px");
            var endShift = $carouselContents.width() - scrollerWidth/2 - $carouselContentsList.width();
            if(pixelsToLeft > beginShift) {
                $carouselContentsList.css("left", beginShift + "px");
            } else if(pixelsToLeft < endShift) {
                $carouselContentsList.css("left", endShift + "px");
            } else {
                $carouselContentsList.css("left", pixelsToLeft + "px");
            }
        }

        //callbacks

        $carouselScrollerBack.mouseover(function() {
            scrollCarouselContentsList(scrollPixels);
        });

        $carouselScrollerBack.mouseout(function() {
            stopScrollCarouselContentsList();
        });

        $carouselScrollerForward.mouseover(function() {
            scrollCarouselContentsList(-scrollPixels);
        });

        $carouselScrollerForward.mouseout(function() {
            stopScrollCarouselContentsList();
        });

        $carouselPrev.click(function() {
            navigateArticles(-1);
        });

        $carouselNext.click(function() {
            navigateArticles(1);
        });

    };

    $.fn.extend({

        disableSelection : function() {
            this.each(function() {
                this.onselectstart = function() {
                    return false;
                };
                this.unselectable = "on";
                $(this).css('-moz-user-select', 'none');
            });
        },

        enableSelection : function() {
            this.each(function() {
                this.onselectstart = function() {
                };
                this.unselectable = "off";
                $(this).css('-moz-user-select', 'auto');
            });
        }

    });

})(jQuery);

function tag(name, attrs, data_or_fun){
    if(!name){ name = 'div' }
    var tag = document.createElement(name);
    if(attrs){
        for(key in attrs){
            tag.setAttribute(key, attrs[key]);
        }
    }
    if(data_or_fun){
        if(typeof data_or_fun === "function"){
            tag.innerHTML = data_or_fun.apply(this);
        }else if(typeof data_or_fun === "object"){
            tag.innerHTML = data_or_fun.toString();
        }
    }
    return tag.outerHTML;
}

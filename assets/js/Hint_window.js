$(function () {
    /*
       hintWindow  抖动元素
       msg 提示信息
       msgele 提示信息的文本元素
       color  图标颜色
       iconText  图标样式文本
       icon   图标元素
       shake  是否需要抖动-默认需要
       

    */
    window.hintwin = function (hintWindow, msg, msgele, color, iconText, icon, shakes = true) {
        hintWindow.show()
        msgele.html(msg)
        icon.css('color', color).html(iconText)

        if (shakes) {
            hintWindow.shake(3, 5, 300)
        }
        setTimeout(function () {
            hintWindow.fadeOut()
            if (icon) {
                icon.html("")
            }
        }, 2000)

    }



    // 抖动函数  $("抖动元素").shake(次数, 距离, 持续时间);
    jQuery.fn.shake = function (intShakes, intDistance, intDuration) {
        this.each(function () {
            var jqNode = $(this);
            // jqNode.css({ position: 'absolute' });
            for (var x = 1; x <= intShakes; x++) {
                jqNode.animate({
                        left: $('.hint').position().left + $('.hint').outerWidth() / 2 + (intDistance * -1)
                    }, (((intDuration / intShakes) / 4)))
                    .animate({
                        left: $('.hint').position().left + $('.hint').outerWidth() / 2
                    }, ((intDuration / intShakes) / 2))
                    .animate({
                        left: '50%'
                    }, (((intDuration / intShakes) / 4)));
            }
        });
        return this;
    }

})
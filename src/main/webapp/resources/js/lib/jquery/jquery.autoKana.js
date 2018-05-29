//Compass用に一部改変
//https://github.com/harisenbon/autokana
//----------
// Copyright (c) 2013 Keith Perhac @ DelfiNet (http://delfi-net.com)
//
// Based on the AutoRuby library created by:
// Copyright (c) 2005-2008 spinelz.org (http://script.spinelz.org/)
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
var isAutokanaLoaded = false;
(function ($) {
    //$.fn.autoKana = function (element1, element2, passedOptions) {
    $.fn.autoKana = function (elName, elKana, passedOptions) { //modify

        var options = $.extend(
            {
                'katakana': false
            }, passedOptions);

        //var kana_extraction_pattern = new RegExp('[^ 　ぁあ-んー]', 'g');
        var kana_extraction_pattern = new RegExp('[^ 　ぁあ-んー0-9０-９－Ａ-Ｚａ-ｚ\-]', 'g'); //modify
        var kana_compacting_pattern = new RegExp('[ぁぃぅぇぉっゃゅょ]', 'g');
        var elName,
            elKana,
            active = false,
            timer = null,
            flagConvert = true,
            input,
            values,
            ignoreString,
            baseKana;
        var prevElName = "";
        //elName = $(element1); //modify
        //elKana = $(element2); //modify
        active = true;
        _stateClear();

        if(!isAutokanaLoaded 
         || !jQuery._data(elName.get(0)).events
         || !jQuery._data(elName.get(0)).events.blur
         || !jQuery._data(elName.get(0)).events.focus
         || !jQuery._data(elName.get(0)).events.keydown
         ){
        elName.blur(_eventBlur);
        elName.focus(_eventFocus);
        elName.keydown(_eventKeyDown);
        isAutokanaLoaded = true;
        }
        function start() {
            active = true;
        };

        function stop() {
            active = false;
        };

        function toggle(event) {
            var ev = event || window.event;
            if (event) {
                var el = Event.element(event);
                if (el.checked) {
                    active = true;
                } else {
                    active = false;
                }
            } else {
                active = !active;
            }
        };

        function _checkConvert(new_values) {
            if (!flagConvert) {
                if (Math.abs(values.length - new_values.length) > 1) {
                    var tmp_values = new_values.join('').replace(kana_compacting_pattern, '').split('');
                    if (Math.abs(values.length - tmp_values.length) > 1) {
                        _stateConvert();
                    }
                } else {
                    if (values.length == input.length && values.join('') != input) {
                        if (input.match(kana_extraction_pattern)) {
                            _stateConvert();
                        }
                    }
                }
            }
        };

        function _checkValue() {
            var new_input, new_values;
            var work_input;
            var work_newInput
            var isThrough;
            new_input = elName.val()
            if (new_input == '') {
                _stateClear();
                _setKana();
            } else {
                new_input = _removeString(new_input);
                if (input == new_input  ) {
                	prevElName =  elName.val();
                    return;
                } else {
                	isThrough = true;
                	//前回文字列から、文字列が削除された場合。
                	if(prevElName !== "" && elName.val() !==""  && prevElName !== elName.val() && prevElName.match(elName.val()) ){
                		isThrough = false;
                	}
                	prevElName =  elName.val();
                	//単語の末尾にカナ変換対象の文字を入力した場合
                	//先頭から見て、スペース以外が0個以上あり、その後ろにカナ変換対象の文字が1文字存在し、その後スペースが入力された場合
                	//スペースの次に、後に上記のパターンが来た場合
                	//例　あ＿　あ胃う＿　|  愛＿う＿　愛＿鵜え＿　等
                	 if(isThrough &&input.length===1 &&/(^[^ 　]*[ぁ-ん0-9０-９Ａ-Ｚａ-ｚー－-][ 　]+$)|([ 　]+[^ 　]*[ぁ-ん0-9０-９Ａ-Ｚａ-ｚー－-][ 　]+$)/.test(elName.val() )){
                		 flagConvert = false;
                		 isThrough = false; 
                	 }
                 	//スペースの入力で、変換済みと認識
                 	//スペースまでの文字の部分を確定と判断する。
                    if(isThrough && /^([^ 　]+[ 　]+)+$/.test(elName.val() )){
                        flagConvert = false;
                        ignoreString = elName.val().trim();
                        isThrough = false;
                    }
                    //前回入力文字+ひらがなの場合、変換済みと認識
                    //前回入力文字の部分を無視する。
                    work_input = input.replace(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/,'');
                    if(isThrough && input !==""  && flagConvert && /[ぁ-ん0-9]/.test(elName.val().replace(ignoreString,'').replace(work_input,'') )){
                            flagConvert = false;
                            ignoreString =  ignoreString + work_input;
                            new_input = _removeString(elName.val());
                            isThrough = false;
                    }
                    
                    work_newInput = new_input.replace(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/,'');
                    if(isThrough &&  input !=="" && flagConvert && /^[ぁ-ん 　]+$/.test(work_input) &&  !/^[ぁ-ん 　]+$/.test(work_newInput) ) {
                        flagConvert = false;
                        ignoreString = ignoreString + new_input;
                        isThrough = false;
                    }
                    
                    input = new_input;
                    if (!flagConvert) {
                        new_values = new_input.replace(kana_extraction_pattern, '').split('');
                        _checkConvert(new_values);
                        _setKana(new_values);
                    }
                }
            }
        };

        function _clearInterval() {
            clearInterval(timer);
        };

        function _eventBlur(event) {
            _clearInterval();
        };
        function _eventFocus(event) {
            _stateInput();
            _setInterval();
        };
        function _eventKeyDown(event) {
            if (flagConvert) {
                _stateInput();
            }
        };
        function _isHiragana(chara) {
            return ((chara >= 12353 && chara <= 12435) || chara == 12445 || chara == 12446);
        };
        function _removeString(new_input) {
            if (new_input.match(ignoreString)) {
                return new_input.replace(ignoreString, '');
            } else {
                var i, ignoreArray, inputArray;
                ignoreArray = ignoreString.split('');
                inputArray = new_input.split('');
                for (i = 0; i < ignoreArray.length; i++) {
                    if (ignoreArray[i] == inputArray[i]) {
                        inputArray[i] = '';
                    }
                }
                return inputArray.join('');
            }
        };
        function _setInterval() {
            var self = this;
            timer = setInterval(_checkValue, 30);
        };
        function _setKana(new_values) {
            if (!flagConvert) {
                if (new_values) {
                    values = new_values;
                }
                if (active) {
                    var _val = _toKatakana(baseKana + values.join(''));
                    elKana.val(_val);
                }
            }
        };
        function _stateClear() {
            baseKana = '';
            flagConvert = false;
            ignoreString = '';
            input = '';
            values = [];
        };
        function _stateInput() {
            baseKana = elKana.val();
            flagConvert = false;
            ignoreString = elName.val();
        };
        function _stateConvert() {
            baseKana = baseKana + values.join('');
            flagConvert = true;
            values = [];
        };
        function _toKatakana(src) {
            // modify - start
            if(options.half_katakana) {
                var str = "";
                for(i=0;i<src.length;i++){
                    var char = src[i];
                    if(cmconst.ConvHalfKanaMap[char]){
                        str += cmconst.ConvHalfKanaMap[char];
                    }else{
                        str += char;
                    }
                }
                return str;
            }
            // modify - end
            if (options.katakana) {
                var c, i, str;
                str = new String;
                for (i = 0; i < src.length; i++) {
                    c = src.charCodeAt(i);
                    if (_isHiragana(c)) {
                        str += String.fromCharCode(c + 96);
                    } else {
                        str += src.charAt(i);
                    }
                }
                return str;
            } else {
                return src;
            }
        }
    };
})(jQuery);

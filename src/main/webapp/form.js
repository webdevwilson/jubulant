$(function() {
   
    var r=$('input[type="text"][name="r"]');
    var t=$('textarea[name="t"]');
    
    // this is a hack, for some reason jquery is having issues eval'ing the json
    // we return
    r.ajaxError(function(evt,j,s,e) {
        var a = eval('(' + j.responseText + ')');
        display(a);
    });
   
    var to;
    var exec=function() {
        var rv=r.val();
        var tv=t.val();
        var fv=$('#form ul li.selected').map(function() {return $(this).data('flag'); }).toArray().join('');
        window.clearTimeout(to);
        to=window.setTimeout(function() {
            $.getJSON('execute', {
                'r':rv, 
                't': tv, 
                'f': fv
            }, function(data) {
                display(rv,fv,tv,data);
            });
        }, 250);
    };
   
    var display = function(r,f,t,data) {
        var h = '';
        if(!data.invalid) {
            h='<b>Matches:</b>' + data.matches;
            if(data.matches && data.groups) {
                h += '<p><b>Groups:</b><ul>';
                for(var i=0; i<data.groups.length;i++) {
                    h += '<li>'+data.groups[i]+'</li>';
                }
                h+='</ul>';
            }
            h+='<h3>Code:</h3><pre>';
            h+='import java.util.regex.Pattern;\n'
            h+='import java.util.regex.Matcher;\n\n'
            h+='final Pattern pattern = Pattern.compile("'+r+'");\n';
            h+='final Matcher matcher = pattern.matcher("'+t+'");';
            h+='</pre>';
        }
        var ar = data.matches && data.groups ? ['match','nomatch'] : ['nomatch','match'];
        if(h=='') $('#results').hide();
        else $('#results #matches').html(h).addClass(ar[0]).removeClass(ar[1]).parent().show();
    };
   
    r.keyup(exec);
    t.keyup(exec);
    
    // handle flag selectors
    $('#form ul li').click(function() {
        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }
        exec();
    });
    
    // show / hide cheatsheet
    $('#cheatsheet h2 a').click(function() {
        if($(this).text() == 'Show') {
            $('#cheatsheet table').slideDown(); 
            $(this).text('Hide');
        } else {
            $('#cheatsheet table').slideUp(); 
            $(this).text('Show');
        }
    });
   
});
$(function() {
   
    var r=$('input[type="text"][name="r"]');
    var t=$('textarea[name="t"]');
   
    r.ajaxError(function(evt,j,s,e) {
        var a = eval('(' + j.responseText + ')');
        display(a);
    });
   
    var exec=function() {
        var rv=r.val();
        var tv=t.val();
        $.getJSON('execute', {
            'r':rv, 
            't': tv, 
            'f': 'a'
        }, function(data) {
            display(data);
        });
    };
   
    var display = function(data) {
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
        }
        $('#results').html(h);
     
    };
   
    r.keyup(exec);
    t.keyup(exec);
    
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
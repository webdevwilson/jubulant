$(function() {
   
    var r=$('input[type="text"][name="r"]'), 
    t=$('input[name="t"]'), to, 
    escape = function(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    display = function(r,f,t,data) {
        var i,h = '', 
	ar = data.matches && data.groups ? ['match','nomatch'] : ['nomatch','match'];
        if(!data.invalid) {
            h='<b>Matches:</b>' + data.matches;
            if(data.matches && data.groups) {
                h += '<p><b>Groups:</b><ul>';
                for(i=0; i<data.groups.length;i++) {
                    h += '<li>'+escape(data.groups[i])+'</li>';
                }
                h+='</ul>';
            }
            h+='<h3>Code:</h3><pre>';
            h+='import java.util.regex.Pattern;\n';
            h+='import java.util.regex.Matcher;\n\n';
            h+='final Pattern pattern = Pattern.compile("'+escape(r)+'");\n';
            h+='final Matcher matcher = pattern.matcher("'+escape(t)+'");';
            h+='</pre>';
        } else {
	    h='Invalid pattern \''+data.description+'\'';
	}
        if(h==='') { $('#results').hide(); }
        else { $('#results #matches').html(h).addClass(ar[0]).removeClass(ar[1]).parent().show();}
    },
    exec=function() {
        var rv=r.val(), 
	tv=t.val(),
	fv=$('#form ul li.selected').map(function() {return $(this).data('flag'); }).toArray().join('');
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
    
    r.keyup(exec);
    t.keyup(exec);
    
    // handle flag selectors
    $('#form ul li').click(function() {
	var t=$(this);
        if(t.hasClass('selected')) {
            t.removeClass('selected');
        } else {
            t.addClass('selected');
        }
	exec();
    });
    
    // swap input for textarea when multiline is selected
    $('#form ul li[data-flag="m"]').click(function() {
	var n,v=t.val(),m=$(this).hasClass('selected');
	n= m ? $('<textarea>', { 'name': t.attr('name') }).val(v) : 
	    $('<input>', { 'type': 'text', 'name': t.attr('name'), 'value': v });
	t.replaceWith(n);
	t=n;
    });
    
    // show / hide cheatsheet
    $('#cheatsheet h2 a, #cheatsheet h3 a').click(function() {
	var t=$(this).parent().next();
        if($(this).text() === 'show') {
            t.slideDown(); 
            $(this).text('hide');
        } else {
            t.slideUp(); 
            $(this).text('show');
        }
	return false;
    });
   
});
package com.goodercode.jubulant;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;

public class RegExServlet extends HttpServlet {

    @Override
    protected void doGet(final HttpServletRequest request,
            final HttpServletResponse response) throws ServletException, IOException {

        final String regex = request.getParameter("r");
        final Integer flag = getFlag(request.getParameter("f"));
        final String text = request.getParameter("t");

        final JSONObject jsonMe = new JSONObject();

        try {
            try {
                final Matcher m = Pattern.compile(regex, flag).matcher(text);

                jsonMe.put("matches", m.matches());

                final String[] groups = new String[m.groupCount() + 1];
                for (Integer i = 0; i <= m.groupCount(); i++) {
                    groups[i] = m.group(i);
                }
                jsonMe.put("groups", groups);
            } catch (final IllegalStateException e) {
                jsonMe.put("matches", false);
            } catch (final PatternSyntaxException e) {
		jsonMe.put("matches", false);  
		jsonMe.put("invalid", true);
		jsonMe.put("description", e.getDescription());
            }
        } catch (final JSONException je) {
            throw new ServletException(je);
        }
        
        response.setContentType("text/json");
        response.getWriter().write(jsonMe.toString());

    }

    private Integer getFlag(final String flags) {

        if (flags == null) {
            return 0;
        }

        Integer flag = 0;
        flag |= flags.contains("c") ? Pattern.CANON_EQ : 0;
        flag |= flags.contains("i") ? Pattern.CASE_INSENSITIVE : 0;
        flag |= flags.contains("a") ? Pattern.COMMENTS : 0;
        flag |= flags.contains("d") ? Pattern.DOTALL : 0;
        flag |= flags.contains("t") ? Pattern.LITERAL : 0;
        flag |= flags.contains("m") ? Pattern.MULTILINE : 0;
        flag |= flags.contains("u") ? Pattern.UNICODE_CASE : 0;
        flag |= flags.contains("l") ? Pattern.UNIX_LINES : 0;
        return flag;
    }
}

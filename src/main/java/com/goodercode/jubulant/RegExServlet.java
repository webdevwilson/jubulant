package com.goodercode.jubulant;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RegExServlet extends HttpServlet {

    @Override
    protected void doGet(final HttpServletRequest request,
            final HttpServletResponse response) throws ServletException, IOException {

        final String regex = request.getParameter("r");
        final String flags = request.getParameter("f");
        final String text = request.getParameter("t");

        final Map<String, String> jsonMe = new HashMap<String, String>();

        try {
            final Matcher m = Pattern.compile(regex).matcher(text);


            jsonMe.put("matches", toJson(m.matches()));
            jsonMe.put("regex", toJson(regex));

            final StringBuilder groups = new StringBuilder();
            for (Integer i = 0; i <= m.groupCount(); i++) {
                groups.append(toJson(m.group(i))).append(",");
            }
            jsonMe.put("groups", "[" + groups.toString().substring(0, groups.length() - 1) + "]");
        } catch (final IllegalStateException e) {
            jsonMe.put("matches", toJson(false));
        }

        response.setContentType("application/json");

        // output to response
        final StringBuilder output = new StringBuilder();
        for (final String key : jsonMe.keySet()) {
            output.append("'").append(key).append("':").append(jsonMe.get(key)).append(",");
        }
        response.getWriter().write("{" + output.toString().substring(0, output.length() - 1) + "}");

    }

    private String toJson(final Object obj) {
        return "'" + obj.toString().replace("'", "\\'") + "'";
    }
}

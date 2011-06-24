package com.goodercode.jubulant;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

public class RegExServletTest {

    private MockHttpServletResponse response;

    private MockHttpServletRequest request;

    private RegExServlet servlet;

    @Before
    public void setup() {
        response = new MockHttpServletResponse();
        request = new MockHttpServletRequest();
        servlet = new RegExServlet();
    }

    @Test
    public void should_set_contentType_to_application_json() throws Exception {
        final String r = "a(bc)d";
        request.setParameter("r", r);
        request.setParameter("f", "");
        request.setParameter("t", "abcd");

        servlet.doGet(request, response);

        assertThat(response.getContentType(), equalTo("text/json"));
    }

    @Test
    public void should_run_regular_expression_and_output_result() throws Exception {

        final String r = "a(bc)d";
        request.setParameter("r", r);
        request.setParameter("f", "");
        request.setParameter("t", "abcd");

        servlet.doGet(request, response);

        final JSONObject json = new JSONObject(response.getContentAsString());
        assertThat(json.getString("regex"), equalTo(r));
        assertThat(json.getBoolean("matches"), is(true));
        assertThat(json.getJSONArray("groups").length(), equalTo(2));

    }

    @Test
    public void should_return_false_when_no_match_found() throws Exception {
        final String r = "a(bc)d";
        request.setParameter("r", r);
        request.setParameter("f", "");
        request.setParameter("t", "xyz");

        servlet.doGet(request, response);

        final JSONObject json = new JSONObject(response.getContentAsString());
        assertThat(json.getBoolean("matches"), is(false));

    }

    @Test
    public void should_return_invalid_when_invalid_regex() throws Exception {
        final String r = "a(bcd";
        request.setParameter("r", r);
        request.setParameter("f", "");
        request.setParameter("t", "xyz");

        servlet.doGet(request, response);

        final JSONObject json = new JSONObject(response.getContentAsString());
        assertThat(json.getBoolean("invalid"), is(true));
    }
}

<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.forum.*" %> 
<%@page language="java" import="view.forumView.*" %> 
<%@page language="java" import="com.google.gson.*" %>

<%   
    StringData forum = new StringData();
    
    String searchId = request.getParameter("id");
    if (searchId == null) {
        forum.errorMsg = "Cannot search for web user - 'id' most be supplied as URL parameter";
    } else {

        DbConn dbc = new DbConn();
        forum.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (forum.errorMsg.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call getPostById");
            forum = Search.getForumById(dbc, searchId);
            
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(forum).trim());
%>
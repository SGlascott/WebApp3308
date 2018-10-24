<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringDataList list = new StringDataList();

    String searchEmail = request.getParameter("email");
    String searchPassword = request.getParameter("pwd");
    
    System.out.printf("%s, %s", searchEmail, searchPassword);
    if (searchEmail == null || searchPassword == null) {
        list.dbError = "Cannot search for user - 'email' most be supplied";
    } else {

        DbConn dbc = new DbConn();
        list.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (list.dbError.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call allUsersAPI");
            list = WebUserView.getUserById(dbc, searchEmail, searchPassword);
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
        session.setAttribute ("user", list);
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(list).trim());
%>

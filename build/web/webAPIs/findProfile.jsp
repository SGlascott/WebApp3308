<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="com.google.gson.*" %>


<%
    StringDataList User = (StringDataList) session.getAttribute("currentUser");
 
    Gson gson = new Gson();
    out.print(gson.toJson(User).trim());
%>

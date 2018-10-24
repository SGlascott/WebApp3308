<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="com.google.gson.*" %>

<%
    StringDataList User = (StringDataList) session.getAttribute("user");

    try{
        session.invalidate();
        out.println("You have successfully logged off!");
    }catch(Exception e){
        User.dbError = "Unable to log off, please check connection and try again!";
    }
%>

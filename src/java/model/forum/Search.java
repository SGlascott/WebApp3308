/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model.forum;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Search {
    public static StringData getForumById(DbConn dbc, String id) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringData sd = new StringData();
        try {
            String sql = "SELECT post_id, post_date, post_title, post_body "
                    + "FROM forum_post "
                    + "WHERE post_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sd = new StringData(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in getForumById: " + e.getMessage();
        }
        System.out.println(sd);
        return sd;
    }
}

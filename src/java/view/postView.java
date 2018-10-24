package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.post.*;

// classes in my project
import dbUtils.*;

public class postView {

    public static StringDataList getAllPosts(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT comment_id, comment_body, comment_date, post_title, first_name "+
                    "FROM  post_comments"
                    + " JOIN (web_user, forum_post)"
                    + " ON (post_comments.comment_user = web_user.web_user_id AND"
                    + " post_comments.comment_forum = forum_post.post_id) " + 
                    "ORDER BY comment_id";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in WebUserView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}

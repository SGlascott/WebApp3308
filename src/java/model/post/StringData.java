package model.post;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {
    public String commentID = "";
    public String commentBody = "";
    public String commentDate = "";
    public String postTitle = "";
    public String firstName = "";
    

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.commentID = FormatUtils.formatInteger(results.getObject("comment_id"));
            this.commentBody = FormatUtils.formatString(results.getObject("comment_body"));
            this.commentDate = FormatUtils.formatDate(results.getObject("comment_date"));
            this.postTitle = FormatUtils.formatString(results.getObject("post_title"));
            this.firstName = FormatUtils.formatString(results.getObject("first_name"));
            
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.commentBody + this.commentDate + this.postTitle 
                + this.firstName;
        return s.length();
    }

    public String toString() {
        return"Body: " + this.commentBody
                + ", Date: " + this.commentDate
                + ", Post Title: " + this.postTitle
                + ", First Name: " + this.firstName;
    }
}

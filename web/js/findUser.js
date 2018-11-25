function findUserFn(userEmail, userPassword) {
    var target = document.getElementById("userInfoHere");

    ajax("webAPIs/LogOnAPI.jsp?email=" + userEmail + "&pwd=" + userPassword, loginSession, loginError);

    function loginSession(httpRequest) {
        var obj = JSON.parse(httpRequest.responseText);
        
        if (obj.webUserList.length === 0)
        {
            target.innerHTML ="<h4> Incorrect username or password</h4>";
        }
        else
        {
            target.innerHTML = "<h4>Welcome you are logged in</h4>";
        }
        
    }

    function loginError(httpRequest) {
        target.innerHTML = "Error trying to make the API call: " + httpRequest.errorMsg;
    }
}

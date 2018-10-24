function findProfileFn()
{
    ajaxCall("webAPIs/findProfile.jsp", displayProfile, processProfileError);
    function displayProfile(){
        var msg = "Successfully called the profile API!";
        var obj = JSON.parse(httpRequest.responseText);
        console.log("Successfully called the profile API. obj contents: ");
        console.log(obj);
        if (obj.webUserList[0].errorMsg.length > 0) {
            msg += "However, the profile API supplied this error message: "
                    + obj.webUserList[0].errorMsg;
        } else {
            msg += "<br/>Web User number " + obj.webUserList[0].webUserId;
            msg += "<br/> &nbsp; Email: " + obj.webUserList[0].userEmail;
            msg += "<br/> &nbsp; Birthday: " + obj.webUserList[0].birthday;
            msg += "<br/> &nbsp; MembershipFee: " + obj.webUserList[0].membershipFee;
            msg += "<br/> &nbsp; User Role Id: " + obj.webUserList[0].userRoleId;
            msg += "<br/> &nbsp; User Role: " + obj.webUserList[0].userRoleType;
        }
        document.getElementById("profileContent").innerHTML = msg;
    }

    function processProfileError(httpRequest) {
        document.getElementById("profileContent").innerHTML = "Logon API call failed: "
                + httpRequest.errorMsg;
    }
}
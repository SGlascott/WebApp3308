var postCRUD = {}; // globally available object


(function () {  // This is an IIFE, an Immediately Invoked Function Expression
    //alert("I am an IIFE!");

    postCRUD.startInsert = function () {

        ajax('htmlPartials/insertUpdatePost.html', setInsertUI, 'content');

        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

        }
    };


    postCRUD.insertSave = function () {

        console.log ("userCRUD.insertSave was called");


        // create a user object from the values that the user has typed into the page.
        var postObj = {
            "postDate": "",
            "postBody": document.getElementById("body").value,
            "postTitle": document.getElementById("postTitle").value,
            "errorMsg": ""
        };
        console.log(postObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        var myData = escape(JSON.stringify(postObj));
        var url = "webAPIs/insertPostAPI.jsp?jsonData=" + myData;
        ajax(url, processInsert, "recordError");

        function processInsert(httpRequest) {
            console.log("processInsert was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
            console.log("here is JSON object (holds error messages.");
            console.log(jsonObj);
            
            document.getElementById("titleError").innerHTML = jsonObj.title;
            document.getElementById("bodyError").innerHTML = jsonObj.body;

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }
            document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
        }
    };
    
    postCRUD.list = function (httpRequest) {

        console.log("listUsersResponse - here is the value of httpRequest object (next line)");
        console.log(httpRequest);

        var dataList = document.createElement("div");
        dataList.id = "dataList"; // this is for styling the HTML table.
        document.getElementById("content").innerHTML = "";
        document.getElementById("content").appendChild(dataList);

        var obj = JSON.parse(httpRequest.responseText);

        if (obj === null) {
            dataList.innerHTML = "listUsersResponse Error: JSON string evaluated to null.";
            return;
        }

        for (var i = 0; i < obj.forumList.length; i++) {

            // add a property to each object in webUserList - a span tag that when clicked 
            // invokes a JS function call that passes in the web user id that should be deleted
            // from the database and a reference to itself (the span tag that was clicked)
            var id = obj.forumList[i].postID;
            obj.forumList[i].delete = "<img src='icons/delete.png'  onclick='postCRUD.delete(" + id + ",this)'  />";
            obj.forumList[i].update = "<img onclick='postCRUD.startUpdate(" + id + ")' src='icons/update.png' />";
        }

        // buildTable Parameters: 
        // First:  array of objects that are to be built into an HTML table.
        // Second: string that is database error (if any) or empty string if all OK.
        // Third:  reference to DOM object where built table is to be stored. 
        buildTable(obj.forumList, obj.dbError, dataList);
        
        };


        postCRUD.delete = function (postId, icon) {
        if (confirm("Do you really want to delete post " + postId + "? ")) {
            console.log("icon that was passed into JS function is printed on next line");
            console.log(icon);

            // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
            // following (delete the row that was clicked from the User Interface).
            ajax("webAPIs/deleteForumAPI.jsp?deleteId=" + postId, APISuccess, APIError);
            function APISuccess(httpReq) { // function is local to callDeleteAPI
                var obj = JSON.parse(httpReq.responseText);
                alert("Web API success. Message is [" + obj.errorMsg + "] -- empty string means success.");
            }

            function APIError(httpReq) { // function is local to callDeleteAPI
                alert("Web API failure. Message is [" + httpReq.errorMsg + "]");
            }
            // icon's parent is cell whose parent is row 
            var dataRow = icon.parentNode.parentNode;
            var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
            var dataTable = dataRow.parentNode;
            dataTable.deleteRow(rowIndex);
        }

    };
    
    postCRUD.startUpdate = function (postId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('htmlPartials/insertUpdatePost.html', setUpdateUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSavePost").style.display = "none";
            //document.getElementById("updateSaveUserButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getPostByIdAPI.jsp?id=" + postId, displayPost, "recordError");

            function displayPost(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                console.log(obj);
                if (obj.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.errorMsg;
                } else {
                    var postObj = obj.forum;
                    document.getElementById("postId").value = postObj.postID;
                    document.getElementById("postTitle").value = postObj.postTitle;
                    document.getElementById("body").value = postObj.postBody;
                }
            }
        } // setUpdateUI
    };

    postCRUD.updateSave = function () {

        console.log("userCRUD.updateSave was called");
        var myData = getUserDataFromUI();
        var url = "webAPIs/updateUserAPI.jsp?jsonData=" + myData;
        ajax(url, processUpdate, "recordError");

        function processUpdate(httpRequest) {
            console.log("processUpdate was called here is httpRequest.");
            console.log(httpRequest);

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fields named exactly 
            // the same as the input data was named. 
            var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
            console.log("here is JSON object (holds error messages.");
            console.log(jsonObj);

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated !!!";
            }

            writeErrorObjToUI(jsonObj);

        }
    };

    // remove commas and $ from user entered dollar amount.
    // private helper function, availble to any functions in the IIFE
    function stripDollar(dollar) {
        dollar = dollar.replace("$", ""); // replace $ with empty string
        dollar = dollar.replace(",", ""); // replace comma with empty string
        return dollar;
    }
    function getUserDataFromUI() {

        var ddList = document.getElementById("rolePickList");

        // strip $ and commas from dollar amount before trying to encode user data for update.
        var dollar = stripDollar(document.getElementById("membershipFee").value);

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
            "webUserId": document.getElementById("webUserId").value,
            "firstName": document.getElementById("firstName").value,
            "lastName": document.getElementById("lastName").value,
            "userEmail": document.getElementById("userEmail").value,
            "userPassword": document.getElementById("userPassword").value,
            "userPassword2": document.getElementById("userPassword2").value,
            "birthday": document.getElementById("birthday").value,
            "membershipFee": dollar,

            // Modification here for role pick list
            "userRoleId": ddList.options[ddList.selectedIndex].value,

            "userRoleType": "",
            "errorMsg": ""
        };

        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        return escape(JSON.stringify(userInputObj));
    }
    
    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("userEmailError").innerHTML = jsonObj.userEmail;
        document.getElementById("userPasswordError").innerHTML = jsonObj.userPassword;
        document.getElementById("userPassword2Error").innerHTML = jsonObj.userPassword2;
        document.getElementById("birthdayError").innerHTML = jsonObj.birthday;
        document.getElementById("membershipFeeError").innerHTML = jsonObj.membershipFee;
        document.getElementById("userRoleIdError").innerHTML = jsonObj.userRoleId;

        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
    }
}());

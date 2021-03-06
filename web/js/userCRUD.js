
var userCRUD = {}; // globally available object


(function () {  // This is an IIFE, an Immediately Invoked Function Expression
    //alert("I am an IIFE!");

    userCRUD.startInsert = function () {

        ajax('htmlPartials/insertUpdateUser.html', setInsertUI, 'content');

        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            ajax("webAPIs/getRolesAPI.jsp", setRolePickList, "userRoleIdError");

            function setRolePickList(httpRequest) {

                console.log("setRolePickList was called, see next line for object holding list of roles");
                var jsonObj = JSON.parse(httpRequest.responseText); // convert from JSON to JS Object.
                console.log(jsonObj);

                if (jsonObj.dbError.length > 0) {
                    document.getElementById("userRoleIdError").innerHTML = jsonObj.dbError;
                    return;
                }

                /*  copy/pasting the first entry from the output of my get role API
                 * 
                 {
                 "dbError": "",
                 "roleList": [
                 {
                 "userRoleId": "1",
                 "userRoleType": "Admin",
                 "errorMsg": ""
                 },
                 */

                // function makePickList(list, keyProp, valueProp, selectListId) {
                makePickList(jsonObj.roleList, "userRoleId", "userRoleType", "rolePickList");
            }
        }
    };


    userCRUD.insertSave = function () {

        console.log ("userCRUD.insertSave was called");

        var ddList = document.getElementById("rolePickList");

        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
            "webUserId": "",
            "firstName": document.getElementById("firstName").value,
            "lastName": document.getElementById("lastName").value,
            "userEmail": document.getElementById("userEmail").value,
            "userPassword": document.getElementById("userPassword").value,
            "userPassword2": document.getElementById("userPassword2").value,
            "birthday": document.getElementById("birthday").value,
            "membershipFee": document.getElementById("membershipFee").value,

            // Modification here for role pick list
            "userRoleId": ddList.options[ddList.selectedIndex].value,

            "userRoleType": "",
            "errorMsg": ""
        };
        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        var myData = escape(JSON.stringify(userInputObj));
        var url = "webAPIs/insertUserAPI.jsp?jsonData=" + myData;
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
            
            document.getElementById("FirstNameError").innerHTML = jsonObj.userFristName;
            document.getElementById("LastNameError").innerHTML = jsonObj.userLastName;
            document.getElementById("userEmailError").innerHTML = jsonObj.userEmail;
            document.getElementById("userPasswordError").innerHTML = jsonObj.userPassword;
            document.getElementById("userPassword2Error").innerHTML = jsonObj.userPassword2;
            document.getElementById("birthdayError").innerHTML = jsonObj.birthday;
            document.getElementById("membershipFeeError").innerHTML = jsonObj.membershipFee;
            document.getElementById("userRoleIdError").innerHTML = jsonObj.userRoleId;

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }
            document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
        }
    };


    userCRUD.list = function (httpRequest) {

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

        for (var i = 0; i < obj.webUserList.length; i++) {

            // add a property to each object in webUserList - a span tag that when clicked 
            // invokes a JS function call that passes in the web user id that should be deleted
            // from the database and a reference to itself (the span tag that was clicked)
            var id = obj.webUserList[i].webUserId;
            obj.webUserList[i].delete = "<img src='icons/delete.png'  onclick='userCRUD.delete(" + id + ",this)'  />";
            obj.webUserList[i].update = "<img onclick='userCRUD.startUpdate(" + id + ")' src='icons/update.png' />";
            // remove a property from each object in webUserList 
            delete obj.webUserList[i].userPassword2;
        }

        // buildTable Parameters: 
        // First:  array of objects that are to be built into an HTML table.
        // Second: string that is database error (if any) or empty string if all OK.
        // Third:  reference to DOM object where built table is to be stored. 
        buildTable(obj.webUserList, obj.dbError, dataList);
        
        };


        userCRUD.delete = function (userId, icon) {
        if (confirm("Do you really want to delete user " + userId + "? ")) {
            console.log("icon that was passed into JS function is printed on next line");
            console.log(icon);

            // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
            // following (delete the row that was clicked from the User Interface).
            ajax("webAPIs/deleteUserAPI.jsp?deleteId=" + userId, APISuccess, APIError);
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
    
    userCRUD.startUpdate = function (userId) {

        console.log("startUpdate");

        // make ajax call to get the insert/update user UI
        ajax('htmlPartials/insertUpdateUser.html', setUpdateUI, "content");

        // place the insert/update user UI into the content area
        function setUpdateUI(httpRequest) {
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

            document.getElementById("insertSaveUserButton").style.display = "none";
            //document.getElementById("updateSaveUserButton").style.display = "inline";

            // Call the Get User by id API and (if success), fill the UI with the User data
            ajax("webAPIs/getUserByIdAPI.jsp?id=" + userId, displayUser, "recordError");

            function displayUser(httpRequest) {
                var obj = JSON.parse(httpRequest.responseText);
                if (obj.webUser.errorMsg.length > 0) {
                    document.getElementById("recordError").innerHTML = "Database error: " +
                            obj.webUser.errorMsg;
                } else if (obj.webUser.webUserId.length < 1) {
                    document.getElementById("recordError").innerHTML = "There is no user with id '" +
                            userId + "' in the database";
                } else if (obj.role.dbError.length > 0) {
                    document.getElementById("recordError").innerHTML += "<br/>Error extracting the Role List options from the database: " +
                            obj.role.dbError;
                } else {
                    var userObj = obj.webUser;
                    document.getElementById("webUserId").value = userObj.webUserId;
                    document.getElementById("firstName").value = userObj.firstName;
                    document.getElementById("lastName").value = userObj.lastName;
                    document.getElementById("userEmail").value = userObj.userEmail;
                    document.getElementById("userPassword").value = userObj.userPassword;
                    document.getElementById("userPassword2").value = userObj.userPassword;
                    document.getElementById("birthday").value = userObj.birthday;
                    document.getElementById("membershipFee").value = userObj.membershipFee;

                    makePickList(obj.role.roleList, // list of key/value objects for role pick list
                            "userRoleId", // key property name
                            "userRoleType", // value property name
                            "rolePickList", // id of dom element where to put role pick list
                            userObj.userRoleId); // key to be selected (role id fk in web_user object)
                }
            }
        } // setUpdateUI
    };

    userCRUD.updateSave = function () {

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


}());  // the end of the IIFE
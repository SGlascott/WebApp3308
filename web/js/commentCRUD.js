var commentCRUD = {}; // globally available object


(function () {  // This is an IIFE, an Immediately Invoked Function Expression
    //alert("I am an IIFE!");

    commentCRUD.startInsert = function () {

        ajax('htmlPartials/insertUpdateAssoc.html', setInsertUI, 'content');

        function setInsertUI(httpRequest) {

            // Place the inserttUser html snippet into the content area.
            console.log("Ajax call was successful.");
            document.getElementById("content").innerHTML = httpRequest.responseText;

        }
    };


    commentCRUD.insertSave = function () {

        console.log ("userCRUD.insertSave was called");


        // create a user object from the values that the user has typed into the page.
        var userInputObj = {
            "commentDate": "",
            "firstName": "",
            "commentBody": document.getElementById("body").value,
            "postTitle": document.getElementById("post").value,
            "errorMsg": ""
        };
        console.log(userInputObj);

        // build the url for the ajax call. Remember to escape the user input object or else 
        // you'll get a security error from the server. JSON.stringify converts the javaScript
        // object into JSON format (the reverse operation of what gson does on the server side).
        var myData = escape(JSON.stringify(userInputObj));
        var url = "webAPIs/insertCommentAPI.jsp?jsonData=" + myData;
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
            
            document.getElementById("bodyError").innerHTML = jsonObj.body;
            document.getElementById("postError").innerHTML = jsonObj.post;

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully inserted !!!";
            }
            document.getElementById("recordError").innerHTML = jsonObj.errorMsg;
        }
    };
    
    commentCRUD.list = function (httpRequest) {

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

        for (var i = 0; i < obj.postList.length; i++) {

            // add a property to each object in webUserList - a span tag that when clicked 
            // invokes a JS function call that passes in the web user id that should be deleted
            // from the database and a reference to itself (the span tag that was clicked)
            var id = obj.postList[i].commentID;
            obj.postList[i].delete = "<img src='icons/delete.png'  onclick='commentCRUD.delete(" + id + ",this)'  />";

        }

        // buildTable Parameters: 
        // First:  array of objects that are to be built into an HTML table.
        // Second: string that is database error (if any) or empty string if all OK.
        // Third:  reference to DOM object where built table is to be stored. 
        buildTable(obj.postList, obj.dbError, dataList);
        
        };


        commentCRUD.delete = function (commentId, icon) {
        if (confirm("Do you really want to delete comment " + commentId + "? ")) {
            console.log("icon that was passed into JS function is printed on next line");
            console.log(icon);

            // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
            // following (delete the row that was clicked from the User Interface).
            ajax("webAPIs/deleteCommentAPI.jsp?deleteId=" + commentId, APISuccess, APIError);
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
}());

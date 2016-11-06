
function searchShare() {
    if(event.keyCode == 13){

        console.log($("#shareSearchKey").val());

        $.ajax({
            url: "http://localhost:7070/book/shareList",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                keyword: $("#shareSearchKey").val()
            },
            success: function (result) {

                $("#shareTable").empty();

                var count = result.length;
                if(count != 0){
                    $("#bookFindResult2").text(count + " Books searched about \"" + $("#keyword").val() + "\"");

                    for(var i=0; i<result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var img = $("<img>").attr("src", result[i].img);
                        var imgTd = $("<td></td>").append(img);

                        var titleTd = $("<td></td>").text(result[i].title);
                        var authorTd = $("<td></td>").text(result[i].author);

                        var shareTag = $("<a></a>").attr("class", "share");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-heart");
                        shareTag.append(iTag);
                        if(result[i].share == null){
                            shareTag.on("click", rentBook);
                        } else{
                            var userId = $("<h5></h5>").text(result[i].id);
                            shareTag.append(userId);
                            iTag.css("color", "black");
                        }
                        var shareTd = $("<td></td>").append(shareTag);

                        var returnTag = $("<a></a>").attr("class", "return");
                        var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-repeat");
                        returnTag.append(iTag2);
                        returnTag.on("click", function () {

                        });
                        var returnTd = $("<td></td>").append(returnTag);

                        tr.append(imgTd);
                        tr.append(titleTd);
                        tr.append(authorTd);
                        tr.append(shareTd);
                        tr.append(returnTd);

                        $("#shareTable").append(tr);

                    }

                }

            },
            error: function () {
                alert("Share Book List AJAX ERROR.");
            }
        });
    }

}

function rentBook() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent().find("td:nth-child(4) > a");

    if(sessionStorage.loginStatus == "login"){
        console.log("rentBook: login");

        $.ajax({
            url: "http://localhost:7070/book/rentBook",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn
            },
            success: function (result) {
                alert("책 대여 성공! " + thisTd.val());
                thisTd.remove();
            },
            error: function () {
                alert("Share Book Add AJAX ERROR.");
            }
        });

    } else{
        alert("로그인 후 이용해주세요!");
    }
}
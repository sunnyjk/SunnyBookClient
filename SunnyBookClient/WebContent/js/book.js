var bookCount;
var reviewCount;
var imgURL;

// 키워드로 도서 검색
function searchBook() {
    if(event.keyCode == 13){

        $("#bookListDiv").show();
        var offset = $("#bookListDiv").offset();
        $("html, body").animate({scrollTop: offset.top}, 400);
        $(".todayP").text("Searched on " + new Date().toLocaleString());

        $.ajax({
            url: "http://localhost:7070/book/bookList",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                keyword : $("#keyword").val()
            },
            success: function (result) {

                $("#bookTable").empty();

                bookCount = result.length;
                if(bookCount != 0){
                    $("#bookFindResult").text(bookCount + " Books searched about \"" + $("#keyword").val() + "\"");

                    for(var i=0; i < result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var imgUrl = $("<img>").attr("src", result[i].img);
                        var imgTd = $("<td></td>").append(imgUrl);

                        var titleTd = $("<td></td>").text(result[i].title);

                        var detailTag = $("<a></a>").attr("class", "detail");
                        var iTag3 = $("<i></i>").attr("class", "glyphicon glyphicon-zoom-in");
                        detailTag.append(iTag3);
                        detailTag.on("click", bookDetail);
                        titleTd.append($("<br>"));
                        titleTd.append(detailTag);

                        var authorTd = $("<td></td>").text(result[i].author);
                        var priceTd = $("<td></td>").text(result[i].price);
                        var deleteTag = $("<a></a>").attr("class", "remove");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-remove");
                        deleteTag.append(iTag);
                        deleteTag.on("click", bookDelete);
                        var deleteBtnTd = $("<td></td>").append(deleteTag);

                        var updateTag = $("<a></a>").attr("class", "update");
                        var iTag2 = $("<i></i>").attr("class", "glyphicon glyphicon-cog");
                        updateTag.append(iTag2);
                        updateTag.on("click", bookInfoUpdate);
                        var updateBtnTd = $("<td></td>").append(updateTag);

                        var reviewTag = $("<a></a>").attr("class", "review");
                        reviewTag.attr("data-target", "#reviewmodal");
                        reviewTag.attr("data-toggle", "modal");
                        var iTag5 = $("<i></i>").attr("class", "glyphicon glyphicon-pencil");
                        reviewTag.append(iTag5);
                        reviewTag.on("click", bookReview);
                        var reviewBtnTd = $("<td></td>").append(reviewTag);

                        var shareTag = $("<a></a>").attr("class", "share");
                        var iTag4 = $("<i></i>").attr("class", "glyphicon glyphicon-heart");
                        shareTag.append(iTag4);
                        shareTag.on("click", bookShare);
                        var shareBtnTd = $("<td></td>").append(shareTag);

                        tr.append(imgTd);
                        tr.append(titleTd);
                        tr.append(authorTd);
                        tr.append(priceTd);
                        tr.append(deleteBtnTd);
                        tr.append(updateBtnTd);
                        tr.append(reviewBtnTd);
                        tr.append(shareBtnTd);

                        $("#bookTable").append(tr);
                    }
                } else {
                    $("#bookFindResult").text("No Results.");
                }

            },
            error : function () {
                alert("Search Book AJAX ERROR.");
            }
        });
    }
}

// 가격순으로 정렬
function mySort() {
    var rows = $("table").find("tbody > tr").get();
    rows.sort(function (a, b) {
        var keyA = Number($(a).children("td").eq(3).text());
        var keyB = Number($(b).children("td").eq(3).text());

        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;

        return 0;
    });

    $.each(rows, function (idx, row) {

        $("table").children("tbody").append(row);

    });
}

// 도서 수정하기
function bookInfoUpdate() {

    var title = $(this).parent().parent().find("td:nth-child(2)").text();
    var author = $(this).parent().parent().find("td:nth-child(3)").text();
    var price = $(this).parent().parent().children("td").eq(3).text();

    var updateTitleBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(title);
    var updateAuthorBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(author);
    var updatePriceBox = $("<input />").attr("type" ,"text").attr("class", "updateBox").val(price);

    $(this).parent().parent().find("td:nth-child(2)").empty();
    $(this).parent().parent().find("td:nth-child(3)").empty();
    $(this).parent().parent().find("td:nth-child(4)").empty();
    $(this).parent().parent().find("td:nth-child(2)").append(updateTitleBox);
    $(this).parent().parent().find("td:nth-child(3)").append(updateAuthorBox);
    $(this).parent().parent().find("td:nth-child(4)").append(updatePriceBox);

    var finishBtn = $("<i></i>").attr("class", "glyphicon glyphicon-ok");
    var updateFinishBtn = $("<a></a>").attr("class", "updateFinish").append(finishBtn);

    var updateTd = $(this).parent().parent().find("td:nth-child(6)");
    updateTd.append(updateFinishBtn);

    // 여기서 해당 TD의 클래스만 속성을 줘야 아이콘이 모두 없어지는 현상을 해결할 수 있을 듯!
    $(".remove").css("visibility", "hidden");
    $(".update").css("visibility", "hidden");
    $(".review").css("visibility", "hidden");
    $(".share").css("visibility", "hidden");

    updateFinishBtn.on("click", function () {
        var isbn = $(this).parent().parent().attr("data-isbn");
        var updateTitle = $(this).parent().parent().find("td:nth-child(2) > input").val();
        var updateAuthor = $(this).parent().parent().find("td:nth-child(3) > input").val();
        var updatePrice = $(this).parent().parent().find("td:nth-child(4) > input").val();

        var thisTd = $(this).parent().parent();

        $.ajax({
            url : "http://localhost:7070/book/bookUpdate",
            type : "GET",
            dataType : "jsonp",
            jsonp : "callback",
            data : {
                isbn : isbn,
                title : updateTitle,
                author : updateAuthor,
                price : updatePrice
            },
            success : function (result) {

                if(result != null){
                    console.log($(this).parent().parent().find("td:nth-child(2)").parent().html());

                    thisTd.find("td:nth-child(2)").text(result.title);
                    thisTd.find("td:nth-child(3)").text(result.author);
                    thisTd.find("td:nth-child(4)").text(result.price);
                }

                $(".updateBox").remove();

                $(".remove").css("visibility", "visible");
                $(".update").css("visibility", "visible");
                $(".review").css("visibility", "visible");
                $(".share").css("visibility", "visible");
                $(".updateFinish").remove();
            },
            error : function () {
                alert("업데이트 에러 발생");
            }
        })

    });

}

// 리뷰달기 모달창 뜰 때 해당 책 이름과 ISBN 값을 전달하는 함수
function bookReview() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    $("#reviewIsbn").attr("value", isbn);

    var title = $(this).parent().parent().find("td:nth-child(2)").text();
    $("#reviewTitle").text(title);
}

// 해당 도서 삭제
function bookDelete() {
    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent();

    $.ajax({
        url : "http://localhost:7070/book/bookDelete",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            isbn : isbn
        },
        success : function (result) {
            console.log("Book Delete Result: " + result);
            thisTd.remove();
            $("#bookFindResult").text(--bookCount + " Books searched about \"" + $("#keyword").val() + "\"");
        },
        error : function () {
            alert("bookDelete AJAX ERROR.");
        }
    });

}

// 도서 상세정보 보여주기
function bookDetail() {

    var isbn = $(this).parent().parent().attr("data-isbn");
    var thisTd = $(this).parent().parent().find("td:nth-child(2)");
    var detailATd = $(this).parent().parent().find("td:nth-child(2) > a");

    $.ajax({
        url : "http://localhost:7070/book/bookDetail",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            isbn : isbn
        },
        success : function (result) {

            var detailDiv = $("<div></div>").attr("class", "detailDiv");

            var dateTd = $("<h6></h6>").text("발행일: " + result.date);
            var pageTd = $("<h6></h6>").text("페이지: " + result.page);
            var supTd = $("<h6></h6>").text("부록: " + result.supplement);
            var pubTd = $("<h6></h6>").text("페이지: " + result.publisher);

            var closeBtn = $("<input>").attr("type", "button").attr("class", "btn").val("CLOSE");
            closeBtn.on("click", function () {
                $(this).parent().remove();
                detailATd.css("visibility", "visible");
            });

            detailDiv.append(dateTd);
            detailDiv.append(pageTd);
            detailDiv.append(supTd);
            detailDiv.append(pubTd);
            detailDiv.append(closeBtn);

            thisTd.append(detailDiv);

            detailATd.css("visibility", "hidden");

        },
        error : function () {
            alert("bookDetail AJAX ERROR.");
        }
    })

}

function bookShare() {

    if(sessionStorage.loginStatus != null){

        var isbn = $(this).parent().parent().attr("data-isbn");
    }

}

// 키워드로 서평찾기
function searchReview() {

    if(event.keyCode == 13){
        $(".todayP").text("Searched on " + new Date().toLocaleString());

        $.ajax({
            url: "http://localhost:7070/book/showReviewByKeyword",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                keyword : $("#reviewSearchKey").val()
            },
            success: function (result) {

                $("#reviewTable").empty();

                reviewCount = result.length;
                if(reviewCount != 0){
                    $("#reviewFindResult").text(reviewCount + " Comments about " + result[0].title);

                    for(var i=0; i < result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var titleTd = $("<td></td>").text(result[i].title);
                        var comTd = $("<td></td>").text(result[i].comments);
                        var idTd = $("<td></td>").text(result[i].id);
                        var dateTd = $("<td></td>").text(result[i].date);

                        var deleteTag = $("<a></a>").attr("class", "remove");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-remove");
                        deleteTag.append(iTag);
                        deleteTag.on("click", deleteReview);
                        var deleteBtnTd = $("<td></td>").append(deleteTag);

                        tr.append(titleTd);
                        tr.append(comTd);
                        tr.append(idTd);
                        tr.append(dateTd);
                        tr.append(deleteBtnTd);

                        $("#reviewTable").append(tr);
                    }

                } else{
                    $("#reviewFindResult").text("No Comments.");
                }



            },
            error : function () {
                alert("Error!!");
            }
        });
    }
}

// 로그인 모달창 input 초기화
function loginTextClear() {
    $("#loginid").val("");
    $("#loginpw").val("");
}

// 책 추가 함수
function addBookClick() {

    var thisTd = $(this).parent().parent().parent().html();

    var newIsbn = $("#newIsbn").val().trim();
    var newTitle = $("#newTitle").val().trim();
    var newDate = $("#newDate").val().trim();
    var newPage = $("#newPage").val().trim();
    var newPrice = $("#newPrice").val().trim();
    var newAuthor = $("#newAuthor").val().trim();
    var newTranslator = $("#newTranslator").val().trim();
    var newSupp = $("#newSupp").val().trim();
    var newPublisher = $("#newPublisher").val().trim();

    // 필수정보 입력되었는지 확인
    if(newIsbn != "" && newTitle != "" && newPrice != "" && newAuthor != ""){
        $.ajax({
            url: "http://localhost:7070/book/addBook",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data : {
                isbn : newIsbn,
                title : newTitle,
                date : newDate,
                page : newPage,
                price: newPrice,
                author : newAuthor,
                trans : newTranslator,
                sup : newSupp,
                pub : newPublisher,
                img : imgURL
            },
            success : function (result) {

                if(result){
                    alert("책 추가 성공!");
                    newIsbn = "";
                    newTitle = "";
                    newDate = "";
                    newPage = "";
                    newPrice = "";
                    newAuthor = "";
                    newTranslator = "";
                    newSupp = "";
                    newPublisher = "";
                    newImgurl = "";
                    $(".addBookImg").remove();
                } else {
                    alert("책 추가 실패!");
                }

            },
            error : function () {
                alert("Book Add AJAX ERROR!");
            }
        });
    } else{
        alert("필수 정보를 입력해주세요.");
    }

}

// 서평 삭제 함수
function deleteReview() {

    if(sessionStorage.loginStatus == "login"){
        var isbn = $(this).parent().parent().attr("data-isbn");
        var reviewId = $(this).parent().parent().find("td:nth-child(3)").text();
        var date = $(this).parent().parent().find("td:nth-child(4)").text();

        var thisTd = $(this).parent().parent();

        $.ajax({
            url : "http://localhost:7070/book/reviewDelete",
            type : "GET",
            dataType : "jsonp",
            jsonp : "callback",
            data : {
                isbn : isbn,
                reviewId : reviewId,
                date : date
            },
            success : function (result) {
                if(result){
                    console.log("Review Delete Result: " + result);
                    thisTd.remove();
                    $("#reviewFindResult").text(--reviewCount + " Comments about " + result[0].title);
                } else{
                    alert("다른 사용자의 서평은 삭제할 수 없습니다.");
                }

            },
            error : function () {
                alert("reviewDelete Error!!");
            }
        });
    } else {
        alert("로그인 후 이용해주세요!");
    }

}

$(document).ready(function () {

    $("#addBookDiv").hide();
    $("#bookListDiv").hide();
    $("#reviewDiv").hide();

    // 로그인 상태일 땐 로그아웃 버튼을, 로그아웃 상태일 땐 로그인 버튼으로 보여주기
    if(sessionStorage.loginStatus == "login"){
        $("#goLogin").text("Logout");
        $("#goLogin").attr("data-target", "");
        $("#goJoin").hide();
    }

    // 책 추가 영역으로 이동(Nav ADD 버튼)
    $("#goAddBook").on("click", function () {

        $("#addBookDiv").slideToggle("slow", function () {

            $("#addBookBtn").on("click", addBookClick);

            $("#addBookCancelBtn").on("click", function () {
                $("#newIsbn").val("");
                $("#newTitle").val("");
                $("#newDate").val("");
                $("#newPage").val("");
                $("#newPrice").val("");
                $("#newAuthor").val("");
                $("#newTranslator").val("");
                $("#newSupp").val("");
                $("#newPublisher").val("");
                $("#newImgurl").val("");
                $(".addBookImg").remove();

                $("#addBookDiv").hide("slow");
            });
        });

        var offset = $("#addBookDiv").offset();
        $("html, body").animate({scrollTop: offset.top}, 400);
    });

    // 회원가입 버튼
    $("#dbJoinBtn").on("click", function () {

        var id = $("#joinId").val();
        var pw = $("#joinPw").val();
        var pw2 = $("#joinPw2").val();
        var name = $("#joinName").val();

        if(id != null && pw != null && pw2 != null){
            if(pw == pw2){
                if($("#idCheckBtn").attr("disabled") == "disabled"){
                    $.ajax({
                        url: "http://localhost:7070/book/join",
                        type: "get",
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            id : id,
                            pw : pw,
                            name : name
                        },
                        success: function (result) {

                            if(result == true){
                                alert("회원가입 완료! 로그인해주세요.");
                            } else{
                                alert("회원가입을 다시 진행해주세요!");
                            }
                            $("#joinId").val("");
                            $("#joinPw").val("");
                            $("#joinPw2").val("");
                            $("#joinName").val("");
                            $("#idCheckBtn").attr("disabled", false);
                        },
                        error: function () {
                            alert("Join AJAX ERROR.");
                            $("#idCheckBtn").attr("disabled", false);
                        }
                    });
                } else{
                    alert("ID 중복체크를 먼저 해주세요.");
                }

            } else {
                alert("비밀번호가 일치하지 않습니다.");
                $("#joinId").val("");
                $("#joinPw").val("");
                $("#joinPw2").val("");
                $("#joinName").val("");
                $("#idCheckBtn").attr("disabled", false);
            }

        } else{
            alert("ID와 PW를 입력해주세요.");
        }

    });

    // 회원가입 ID 중복확인 버튼
    $("#idCheckBtn").on("click", function () {
       var id = $("#joinId").val();

        if(id != ""){
            $.ajax({
                url: "http://localhost:7070/book/join",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    id : id
                },
                success: function (result) {
                    if(result){
                        $("#idCheckBtn").attr("disabled", true);
                        alert("사용 가능한 ID 입니다.");
                    } else{
                        alert("이미 사용중인 ID 입니다.");
                    }
                },
                error: function () {
                    alert("Join2 AJAX ERROR.");
                }
            });
        } else {
            alert("ID를 입력해주세요.");
        }

    });

    // 로그아웃 버튼
    $("#goLogin").on("click", function () {

        if ($("#goLogin").text().trim() == "Logout") {

            $.ajax({
                url: "http://localhost:7070/book/logout",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {},
                success: function (result) {

                    if(result = true){
                        alert("로그아웃 성공!");
                        loginTextClear();
                        $("#goLogin").text("Login");
                        $("#goLogin").attr("data-target", "#loginmodal");
                        $("#goJoin").show();
                        sessionStorage.loginStatus = "logout";

                    } else{
                        alert("로그아웃 실패!");
                    }
                },
                error: function () {
                    alert("Logout AJAX Error!");
                }
            });


        }

    });

    $("#loginCancel").on("click", loginTextClear);

    // 로그인 버튼
    $("#loginBtn").on("click", function () {

        var id = $("#loginid").val().trim();
        var pw = $("#loginpw").val().trim();

        if(id == "" || pw == ""){
            alert("ID 혹은 PW을 입력하세요.");
        } else{

            $.ajax({
                url: "http://localhost:7070/book/login",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    id : id,
                    pw : pw
                },
                success: function (result) {

                    if(result = true){
                        alert("로그인 성공!");
                        $("#goLogin").text("Logout");
                        $("#goLogin").attr("data-target", "");
                        $("#goJoin").hide();

                        sessionStorage.loginStatus = "login";

                        if(result.share != null){
                            $(".badge").text(1);
                        }

                    } else{
                        alert("로그인 실패!");
                    }
                },
                error: function () {
                    alert("Login AJAX Error!");
                }
            });
        }

        loginTextClear();

    });

    // 서평 검색 영역으로 이동(Nav Book Review 버튼)
    $("#goReview").on("click", function () {
        $("#reviewDiv").show();
        var offset = $("#reviewDiv").offset();
        $("html, body").animate({scrollTop: offset.top}, 400);
    });

    // 서평 등록하기 버튼
    $("#reviewBtn").on("click", function () {
        $("#reviewDiv").show();

        var isbn = $("#reviewIsbn").val();
        alert("Review register!! " + isbn);

        if(sessionStorage.loginStatus == "login"){
            $.ajax({
                url: "http://localhost:7070/book/review",
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    isbn: isbn,
                    title: $("#reviewTitle").text(),
                    comments: $("#reviewT").val()
                },
                success: function (result) {

                    if(result == true){
                        alert("서평 등록!");
                    } else{
                        alert("로그인 후 이용해주세요!");
                    }
                },
                error: function () {

                }
            });
        } else {
            alert("로그인 후 이용해주세요!");
        }

        $("#reviewT").val("");
    });

    // ISBN 값으로 서평 찾기
    $("#goReviewPage").on("click", function () {

        $("#reviewDiv").show();

        var offset = $("#reviewDiv").offset();
        $("html, body").animate({scrollTop: offset.top}, 400);
        $(".todayP").text("Searched on " + new Date().toLocaleString());

        $.ajax({
            url: "http://localhost:7070/book/showReviewByIsbn",
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn : $("#reviewIsbn").val()
            },
            success: function (result) {

                reviewCount = result.length;

                $("#reviewTable").empty();

                if(reviewCount != 0){
                    $("#reviewFindResult").text(reviewCount + " Comments about " + result[0].title);

                    for(var i=0; i < result.length; i++){
                        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);

                        var titleTd = $("<td></td>").text(result[i].title);
                        var comTd = $("<td></td>").text(result[i].comments);
                        var idTd = $("<td></td>").text(result[i].id);
                        var dateTd = $("<td></td>").text(result[i].date);

                        var deleteTag = $("<a></a>").attr("class", "remove");
                        var iTag = $("<i></i>").attr("class", "glyphicon glyphicon-remove");
                        deleteTag.append(iTag);
                        deleteTag.on("click", deleteReview);
                        var deleteBtnTd = $("<td></td>").append(deleteTag);

                        tr.append(titleTd);
                        tr.append(comTd);
                        tr.append(idTd);
                        tr.append(dateTd);
                        tr.append(deleteBtnTd);

                        $("#reviewTable").append(tr);
                    }
                } else{
                    $("#reviewFindResult").text("No Comments.");
                }

            },
            error : function () {
                alert("Error!!");
            }
        });

    });

})


// 책 추가 이미지 drop&drop 함수
function dDrop() {

    var newImg = new Image();   // 내용이 없는 이미지 문서객체를 생성
    var f = event.dataTransfer.files[0];
    var imgReader = new FileReader();

    imgReader.onload = function(){
        newImg.src = event.target.result;
        imgURL = newImg.src;
        document.getElementById("bookImgDiv").appendChild(newImg);
        $("#bookImgDiv > img").attr("class", "addBookImg");
    };

    imgReader.readAsDataURL(f);

    event.preventDefault();

}

let page = 0;
function logout() {
  if (localStorage.getItem("user_id") === null) {
    alert("이미 로그아웃 상태 입니다.");
    return;
  }
  alert("로그아웃 되었습니다.");
  localStorage.clear();
  window.location.href = "./board.html";
}
function isMember() {
  let user_id = localStorage.getItem("user_id");
  user_id !== null
    ? alert(`이미 로그인 된 상태입니다\n아이디: ${user_id}`)
    : (window.location.href = "./register.html");
}
$(document).ready(function () {
  $("#user_id").append(localStorage.getItem("user_id"));
  let post_no = localStorage.getItem("post_no");
  if (post_no !== undefined || post_no !== null) {
    read_one(post_no);
    read_cmt(post_no);
  }
});

function read_one(post_no) {
  $("#post").empty();
  let temp_html = ``;
  $.ajax({
    type: "GET",
    url: `/api/posts/one/${post_no}`,
    success: function (response) {
      let post = response["post"];
      let isReadonly = "",
        isDisabled = "";
      if (post["user_id"] === localStorage.getItem("user_id")) {
        isReadonly = "";
      } else {
        isReadonly = "readonly";
        post_no = 0;
        isDisabled = "disabled";
      }
      temp_html = `<div class="form-group">
                                <label for="email">제목</label>
                                <input type="text" class="form-control" id="title" value="${post["title"]}" ${isReadonly}>
                            </div>
                            <div class="form-group">
                                <label for="message">내용</label>
                                <textarea name="message" class="form-control" id="context" rows="5" ${isReadonly}>${post["context"]}</textarea>
                            </div>
                            <button type="submit" class="btn btn-danger float-right ${isDisabled}" onclick="delete_post(${post_no})">삭제</button>
                            <button type="submit" class="btn btn-primary float-right ${isDisabled}" onclick="modify_post(${post_no})">수정</button>`;
      $("#post").append(temp_html);
    },
  });
}

function new_post() {
  let user_id = localStorage.getItem("user_id");
  let title = $("#title").val();
  let context = $("#context").val();
  $.ajax({
    type: "POST",
    url: "/api/posts",
    data: { user_id, title, context },
    success: function (response) {
      alert("저장되었습니다.");
      window.location.href = "./board.html";
    },
  });
}

function delete_post(post_no) {
  if (post_no === 0) {
    alert("본인 게시글만 수정 삭제 할 수 있습니다.");
    return;
  }
  $.ajax({
    type: "DELETE",
    url: `/api/posts/${post_no}`,
    success: function (response) {
      alert("삭제되었습니다.");
      location.href = "/board.html";
    },
  });
}

function modify_post(post_no) {
  if (post_no === 0) {
    alert("본인 게시글만 수정 삭제 할 수 있습니다.");
    return;
  }
  let title = $("#title").val();
  let context = $("#context").val();
  $.ajax({
    type: "PUT",
    url: `/api/posts/one/${post_no}`,
    data: { title, context },
    success: function (response) {
      alert("수정되었습니다.");
      location.href = "/board.html";
    },
  });
}

function new_cmt() {
  let post_no = localStorage.getItem("post_no");
  let user_id = localStorage.getItem("user_id");
  let cmt = $("#new-cmt").val();
  $.ajax({
    type: "POST",
    url: "/api/replies",
    data: { post_no, user_id, cmt },
    success: function (response) {
      alert("저장되었습니다.");
      window.location.reload();
    },
  });
}

function read_cmt(post_no) {
  $.ajax({
    type: "GET",
    url: `/api/replies/${post_no}`,
    success: function (response) {
      let replies = response["replies"];
      console.log(replies);
      if (replies.length === 0) $("#alert-cmt").append("아직 댓글이 없습니다.");
      for (let i = 0; i < replies.length; i++) {
        get_cmt(replies[i]);
      }
    },
  });
}

function get_cmt(replies) {
  let isReadonly = "",
    isDisabled = "";
  let cmt_no = 0;
  if (replies["user_id"] === localStorage.getItem("user_id")) {
    isReadonly = "";
    cmt_no = replies["cmt_no"];
  } else {
    isReadonly = "readonly";
    isDisabled = "disabled";
    cmt_no = 0;
  }
  let temp_html = `<tr>
                            <td style="width: 10%;">${replies["user_id"]}</td>
                            <td style="width: 50%;">${replies["cmt"]}</td>
                            <td style="width: 20%;">${replies["ins_date"]}</td>
                            <td style="width: 20%;">
                                <button class="btn btn-danger float-right ${isDisabled}" onclick="delete_cmt('${cmt_no}')">삭제</button>
                                <button class="btn btn-primary float-right ${isDisabled}" onclick="before_modify('${cmt_no}', '${replies["cmt"]}')">수정</button>
                            </td>
                        </tr>`;
  $("#cmt-table").append(temp_html);
}

function before_modify(cmt_no, cmt) {
  if (Number(cmt_no) === 0) {
    alert("본인 댓글만 수정 삭제 할 수 있습니다.");
    return;
  }
  $("#cmt-box").empty();
  $("#modi-cmt").focus();
  let temp_html = `<td>내 댓글 수정하기</td>
                        <td colspan="4"><input type="text" class="form-control" id="modi-cmt" value="${cmt}"></td>
                        <td><button class="btn btn-primary" onclick="modify_cmt('${cmt_no}')">수정</button></td>`;
  $("#cmt-box").append(temp_html);
}

function modify_cmt(cmt_no) {
  let cmt = $("#modi-cmt").val();
  let post_no = localStorage.getItem("post_no");
  $.ajax({
    type: "PUT",
    url: `/api/replies/one/${cmt_no}`,
    data: { cmt },
    success: function (response) {
      alert("수정되었습니다.");
      location.reload();
    },
  });
}

function delete_cmt(cmt_no) {
  if (Number(cmt_no) === 0) {
    alert("본인 게시글만 수정 삭제 할 수 있습니다.");
    return;
  }
  $.ajax({
    type: "DELETE",
    url: `/api/replies/one/${cmt_no}`,
    success: function (response) {
      alert("삭제되었습니다.");
      location.reload();
    },
  });
}

function pagination(currentPage, maxPage) {
  $("#page_nav").empty();
  $("#list").empty();
  let prevClass = "",
    nextClass = "";
  if (currentPage === 1) prevClass = "disabled";
  if (currentPage === maxPage) nextClass = "disabled";
  let temp_html = `<li class="page-item"><a class="page-link prevClass" onclick="read_all('${
    currentPage - 1
  }')">전</a></li>
                        <li class="page-item"><a class="page-link">${currentPage}</a></li>
                        <li class="page-item"><a class="page-link nextClass" onclick="read_all('${
                          currentPage + 1
                        }'>후</a></li>`;
  $("#page_nav").append(temp_html);
}

function getSelf(post_no) {
  $.ajax({
    type: "GET",
    url: "/api/user/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      let user_info = response["user"];
      localStorage.setItem("user_id", user_info["user_id"]);
      new_cmt();
    },
    error: function (xhr, status, error) {
      if (confirm("로그인이 후 이용 가능합니다.\n로그인 하시겠습니까?")) {
        localStorage.clear();
        window.location.href = "./register.html";
      } else {
        window.location.href = "./board.html";
      }
    },
  });
}
function like_it() {
  if (localStorage.getItem("isLike") !== "Y") {
    if (localStorage.getItem("user_id") !== null) {
      let temp_dislike = `<button class="btn btn-secondary float-left" onclick="dislike_it()"><i class="fa fa-thumbs-down"> 취소</i></button>`;
      $("#like-it").empty().append(temp_dislike);
      let post_no = localStorage.getItem("post_no");
      $.ajax({
        type: "PUT",
        url: `/api/posts/like/${post_no}`,
        data: { val: +1 },
        success: function (response) {
          localStorage.setItem("isLike", "Y");
        },
      });
    } else {
      if (confirm("로그인이 필요합니다.\n로그인 합니까?")) {
        location.href = "./register.html";
      }
    }
  } else {
    if (confirm("이미 추천한 게시글 입니다.\n추천을 취소합니까?")) {
      dislike_it();
    }
  }
}
function dislike_it() {
  let temp_like = `<button class="btn btn-danger float-left" onclick="like_it()"><i class="fa fa-thumbs-up"> 추천</i></button>`;
  $("#like-it").empty().append(temp_like);
  let post_no = localStorage.getItem("post_no");
  $.ajax({
    type: "PUT",
    url: `/api/posts/like/${post_no}`,
    data: { val: -1 },
    success: function (response) {
      localStorage.removeItem("isLike");
    },
  });
}

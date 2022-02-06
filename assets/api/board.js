let page = 0;
let post_no = 0;

$(document).ready(function () {
  read_all();
});

function goNewPost() {
  getSelf();
  location.href = './newPost.html';
}

function logout() {
  if (localStorage.getItem('user_id') === null) {
    alert('이미 로그아웃 상태 입니다.');
    return;
  }
  alert('로그아웃 되었습니다.');
  localStorage.clear();
  window.location.href = './board.html';
}

function isMember() {
  let user_id = localStorage.getItem('user_id');
  user_id !== null
    ? alert(`이미 로그인 된 상태입니다\n아이디: ${user_id}`)
    : (window.location.href = './register.html');
}

function getSelf() {
  $.ajax({
    type: 'GET',
    url: '/api/user/me',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      let user_info = response['user'];
      localStorage.setItem('user_id', user_info['user_id']);
      window.location.href = './newPost.html';
    },
    error: function (xhr, status, error) {
      //localStorage.clear();
      if (confirm('로그인이 후 이용 가능합니다.\n로그인 하시겠습니까?')) {
        window.location.href = './register.html';
      } else {
        window.location.href = './board.html';
      }
    },
  });
}

function read_all(page) {
  if (page < 0 || page === undefined) page = 1;
  $.ajax({
    type: 'GET',
    url: `/api/posts?page=${page}`,
    data: {},
    success: function (response) {
      let posts = response['posts'];
      let nowPage = response['nowPage'];
      let maxPage = response['maxPage'];
      pagination(nowPage, maxPage);
      for (let i = 0; i < posts.length; i++) {
        addList(posts[i]);
      }
    },
  });
}

function addList(posts) {
  let user_id = localStorage.getItem('user_id');
  let writer = '';
  posts['user_id'] === user_id
    ? (writer = '<strong>내가 쓴글</strong>')
    : (writer = posts['user_id']);
  let temp_html = `<tr>
                        <td style="width: 10%;">${posts['post_no']}</td>
                        <td style="width: 10%;">${writer}</td>
                        <td style="width: 40%;"><a href="javascript:goModify('${posts['post_no']}')">${posts['title']}</a></td>
                        <td style="width: 20%;">${posts['ins_date']}</td>
                        <td style="width: 10%;">${posts['hit']}</td>
                        <td style="width: 10%;">${posts['like']}</td>
                    </tr>`;
  $('#list').append(temp_html);
}

function goModify(post_no) {
  localStorage.setItem('post_no', post_no);
  $.ajax({
    type: 'PUT',
    url: `/api/posts/hit/${post_no}`,
    success: function (response) {},
  });
  window.location.href = './modify.html';
}

function pagination(currentPage, maxPage) {
  $('#page_nav').empty();
  $('#list').empty();
  let prevPage = currentPage - 1;
  let nextPage = currentPage + 1;
  let prevClass = '',
    nextClass = '';
  if (currentPage === 1) prevClass = 'disabled';
  if (currentPage === maxPage) nextClass = 'disabled';
  let temp_html = `<li class="page-item ${prevClass}"><a class="page-link" onclick="read_all('${prevPage}')"> 이전 </a></li>
                    <li class="page-item"><span class="page-link"> [ ${currentPage} ] <span class="sr-only">(current)</span></span></li>
                    <li class="page-item ${nextClass}"><a class="page-link" onclick="read_all('${nextPage}')"> 다음 </a></li>`;
  $('#page_nav').append(temp_html);
}

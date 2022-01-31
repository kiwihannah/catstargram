$(document).ready(function() {
    $('#myModal').modal(); 
});

function null_check( name, id, pw1, pw2){
    if (name === "" || id === "" || pw1 === "" || pw2 === "") {
        alert("필요정보를 모두 입력해 주세요.");
        return false;
    }
}

function validate_id(id) {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{3,16}$/;
    return regExp.test(id);
}

function validate_pw() {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{3,16}$/;
    if(!regExp.test($("#reg-user-pw").val())) {
        $("#pw-alert-1").empty();
        $("#pw-alert-1").append("<p style='color:red'>비밀번호는 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성되어야 합니다.</p>");
        $("#reg-user-pw").val("").focus();
    } else if($("#reg-user-pw").val() === ($("#reg-user-id").val())) {
        $("#pw-alert-1").empty();
        $("#pw-alert-1").append("<p style='color:red'>비밀번호는 아이디와 동일하게 입력할 수 없습니다.</p>");
        $("#reg-user-pw").val("").focus();
    } else {
        $("#pw-alert-1").empty();
    }			
}

function dup_pw() {
    if ($("#reg-user-pw").val() !== $("#reg-user-pw-confirm").val()){
        $("#pw-alert-2").empty();
        $("#pw-alert-2").append("<p style='color:red'>비밀번호가 일치하지 않습니다.</p>");
        $("#reg-user-pw-confirm").val("").focus();
    } else {
        $("#pw-alert-2").empty();
    }
}

function dup_check() {
    const user_id = $("#reg-user-id").val();
    if (validate_id(user_id)) {
        $.ajax({
            type: "GET",
            url: "/api/user/id_dup_ckeck/"+ user_id,
            data: {
                user_id_give: user_id
            },
            success: function (response) {
                if (response["msg"] === -1) {
                    $("#id-alert").empty();
                    $("#id-alert").append("<p style='color:red'>중복된 아이디 입니다.</p>");
                    $("#reg-user-id").empty().focus();
                    return;
                } else {
                    $("#id-alert").empty();
                    $("#id-alert").append("<p style='color:green'>가입 가능한 아이디 입니다.</p>");
                }
            } 
        });
    } else {
        $("#id-alert").empty();
        $("#id-alert").append("<p style='color:red'>닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성되어야 합니다.</p>");
        $("#reg-user-id").val("").focus();
    }
    
}

function register() {
    let cat_name = $("#reg-cat-name").val();
    let user_id = $("#reg-user-id").val();
    let user_pw1 = $("#reg-user-pw").val();
    let user_pw2 = $("#reg-user-pw-confirm").val();
    null_check(cat_name, user_id, user_pw1, user_pw2);
    
    $.ajax({
        type: "POST",
        url: "/api/user/new",
        data: {
            cat_name_give: cat_name,
            user_id_give: user_id,
            user_pw_give: user_pw1
        },
        success: function (response) {
            if (confirm("회원가입을 축하드립니다!\n로그인 하시겠습니까?")){
                $('#myModal').modal();
            } else {
                window.location.href = "./index.html";
            }
        }
    });

}

function login() {
    let user_id = $("#login-user_id").val();
    let user_pw = $("#login-user-pw").val();
    if (user_id === "" || user_pw === "") {
        alert("필요한 정보를 모두 입력해 주세요");
        return false;
    } 

    $.ajax({
        type: "POST",
        url: "/api/user/auth",
        data: {
            user_id_give: user_id,
            user_pw_give: user_pw

        },
        success: function (response) {
            if (response['msg'] === true) {
                window.location.replace("/")
            } else {
                alert(response['msg']);
            }
        }
    });
}
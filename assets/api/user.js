$(document).ready(function() {
    $('#myModal').modal(); 
});

function null_check( id, pw1, pw2){
    if (id === "" || pw1 === "" || pw2 === "") {
        alert("필요정보를 모두 입력해 주세요.");
        $("#btn-login").classList.add("disabled");
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
        $("#pw-alert-1").append("<p style='color:red'>최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)</p>");
        $("#reg-user-pw").val("").focus();
        $("#btn-login").classList.add("disabled");
    } else if($("#reg-user-pw").val() === ($("#reg-user-id").val())) {
        $("#pw-alert-1").empty();
        $("#pw-alert-1").append("<p style='color:red'>비밀번호는 아이디와 동일하게 입력할 수 없다.</p>");
        $("#reg-user-pw").val("").focus();
        $("#btn-login").classList.add("disabled");
    } else {
        $("#pw-alert-1").empty();
    }			
}

function dup_pw() {
    if ($("#reg-user-pw").val() !== $("#reg-user-pw-confirm").val()){
        $("#pw-alert-2").empty();
        $("#pw-alert-2").append("<p style='color:red'>비밀번호가 일치하지 않습니다.</p>");
        $("#reg-user-pw-confirm").val("").focus();
        $("#btn-login").classList.add("disabled");
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
            data: { user_id },
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
        $("#id-alert").append("<p style='color:red'>3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)</p>");
        $("#reg-user-id").val("").focus();
    }
    
}

function register() {
    let user_id = $("#reg-user-id").val();
    let user_pw = $("#reg-user-pw").val();
    let user_pw2 = $("#reg-user-pw-confirm").val();
    console.log(user_id, user_pw);
    null_check( user_id, user_pw, user_pw2);
    
    $.ajax({
        type: "POST",
        url: "/api/user/new",
        data: { user_id, user_pw },
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
    let user_id = $("#login-user-id").val();
    let user_pw = $("#login-user-pw").val();
    console.log(user_id, user_pw)
    if (user_id === "" || user_pw === "") {
        alert("필요한 정보를 모두 입력해 주세요");
        return false;
    } 

    $.ajax({
        type: "POST",
        url: "/api/user/auth",
        data: { user_id, user_pw },
        success: function (response) {
            if (response['msg'] === true) {
                localStorage.setItem("token", response["token"]);
                localStorage.setItem("user_id", response["user"]["user_id"]);
                window.location.replace("/");
            } else {
                alert("입력하신 아이디 또는 패스워드가 알맞지 않습니다.");
            }
        }
    });
}

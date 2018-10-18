function validatePassword(e) {
    var p1 = document.getElementById('password');
    var p2 = document.getElementById('r_password');
    if(p1.value != p2.value){
        e.preventDefault();
    alert('Passwords musts be same.');
    }
    else{
        register();
    }
}

function register(){
    var data = {};
    let ele = document.getElementsByTagName('input');
    for(let i=0;i< ele.length;i++){
        var id = ele[i].id;
        data[ele[i].id] = ele[i].value;
    }
    console.log(data);
    $.post('/user/register',data,function(response, status){
        alert(response);
    });
}

$(document).ready(function(){
    var btn = document.getElementById('register');
    btn.addEventListener('click', validatePassword);
});

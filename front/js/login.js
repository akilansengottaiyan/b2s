function login(){
    var data = {};
    let ele = document.getElementsByTagName('input');
    for(let i=0;i< ele.length;i++){
        var id = ele[i].id;
        data[ele[i].id] = ele[i].value;
    }
    console.log(data);
    $.post('/user/login',data,function(response,status){
        alert(response);
    });
}

$(document).ready(function(){
    var btn = document.getElementById('login');
    btn.addEventListener('click',login);
});

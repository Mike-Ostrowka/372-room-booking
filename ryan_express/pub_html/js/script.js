$(document).ready(function(){
    console.log("call GET users-api")
    $.ajax({
        method: 'get',
        url: '/users-api',
        data:'',
        success: printBookings
    })
})

function printBookings(data){
    $('body>ul').empty()
    $.each(data, function(){
        $('<li>').html(this.fname+ " " + this.lname + " " + this.pid + "<span> &times;</span>")
        .appendTo('body>ul')
    })
    $('span').off('click').click(function(){
        var name = $(this).parent().text().split(" ")
        $.ajax({
            method: 'delete',
            url: '/users-api/'+name[2],
            data:'',
            success: printBookings
        })
    })
}

function addBooking(){
    $.ajax({
        method: 'post',
        url: '/users-api',
        data:'fname='+$('#fname').val()+'&lname='+$('#lname').val()+
              '&pid='+$('#pid').val(),
        success: printBookings
    })
}
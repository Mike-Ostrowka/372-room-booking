$(document).ready(function(){
    console.log("call GET users-api")
    $.ajax({
        method: 'get',
        url: '/bookings-api',
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
            url: '/bookings-api/'+name[2],
            data:'',
            success: printBookings
        })
    })
}

function loginCallback(data){
    console.log(data);
    $(document)
}

function login(){
    $.ajax({
        method: 'post',
        url: '/login-api',
        data: 'username='+$('#usernameEntry').val()+'&password='+$('#passwordEntry').val(),
        success: loginCallback
    })
}

function addBooking(){
    $.ajax({
        method: 'post',
        url: '/bookings-api',
        data:'id='+`12`+'&start='+$('#bookingDateInput').val()+
              '&room='+$('#bookingRoom').val(),
        success: printBookings
    })
}
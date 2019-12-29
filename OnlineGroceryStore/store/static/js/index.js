// using jQuery, get the csrf token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$('#searchText').keydown(
    function (e) {
        $.ajax({
            url:'autoFillSearch',
            type: 'POST',
            data: {'searchText': $('#searchText').val(),
                    'state': $('#storeState').data('state')},
            success: function (searchList) {
                $('#searchText').typeahead({source:searchList['resp']});
            }
        })
    }
);
$('#searchProduct').click(function (e) {

    if ($('#searchText').val() === '') {
        return false;
    }

    e.preventDefault();


    formData = {
        'searchText': $('#searchText').val(),
        'state': $('#storeState').data('state')
    };


    $.ajax({
        url: 'searchProduct',
        type: 'POST',
        data: formData,
        success: function (data) {
            // window.location = window.location.href;
            var productDisplay = document.getElementById('productDisplay');
            productDisplay.innerHTML = data;
        },

        error: function (XHR, textStatus, errorThrown) {
            productDisplay.innerHTML = "Something is wrong, try later.";
            return false;
        }
    })
});

function addToCart(reqFrom) {
    if (reqFrom.parentNode.children.quantity.value < 0) {
        //alert('Quantity must be +ve integer');
        reqFrom.parentNode.children.quantity.setCustomValidity('Quantity must be +ve integer');
        return false;
    }
    else {
        reqFrom.parentNode.children.quantity.setCustomValidity('');
    }

    return true;
}
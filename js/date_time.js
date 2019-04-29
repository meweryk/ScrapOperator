var document, myDate, year, month, dn, day, h, m, s, months, days, mon, result;
$(function() {
    $(document).ready(date_time); // событие загрузки html, определяем размер окна таблицы

});

function date_time() {
    myDate = new Date();
    year = myDate.getFullYear();
    month = myDate.getMonth();
    dn = myDate.getDate();
    day = myDate.getDay();
    h = myDate.getHours();
    m = myDate.getMinutes();
    s = myDate.getSeconds();
    days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    mon = month + 1;
    if (mon < 10) {
        mon = "0" + mon;
    }
    if (dn < 10) {
        dn = "0" + dn;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    result = ' ' + days[day] + '&nbsp; &nbsp;' + dn + '.' + mon + '.' + year + '&nbsp; &nbsp;' + h + ':' + m + ':' + s;
    document.getElementById("date_time").innerHTML = result;
    setTimeout(date_time, 1000);
    return true;
}
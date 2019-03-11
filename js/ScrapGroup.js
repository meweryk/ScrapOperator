/*globals $:false */
var window, document;

function ChangeSize() {
    var ww = window.innerWidth; //ширина окна 
    var tw = $(".scrapgroup").width(); //ширина таблицы
    var ch = $("section").height(); //высота основного блока
    document.getElementById("scrap").style.width = tw + "px"; //установка ширины блока с таблицей
    $("#scrap").css("height", ((ch - 17) + "px")); //высота блока с шапкой и таблицей равна высоте основного контейнера                   
    $(".scroll").css("height", ((ch - 17) + "px")); //высота блока с таблицей                 
    $(".fixFox").css("width", (tw + "px")); //устанавливаем ширину блока с шапкой
    $(".scroll").css("width", ((tw + 17) + "px")); //устанавливаем ширину блока с таблицей
    if (ww < (tw + 17)) {
        $(".content").css("width", (ww + "px")); //установка ширины в jquery            	
    } //прокрутка если окно меньше ширины окна (для мобильных)
}


$(function() {
    $(window).ready(ChangeSize); // событие загрузки html, определяем размер окна таблицы
    $(window).resize(ChangeSize); // событие изменения окна браузера, определяем размер окна таблицы
    /*window.addEventListener("resize", function() {
        alert("Размер окна теперь равен " + window.innerWidth + "px");
    });*/ // событие ресайз окна браузера
    //прикрепляем клик по заголовкам acc-head, аккордеон просмотр
    $('#accordeon .acc-head').on('click', f_acc);
});

function f_acc() {
    //скрываем все кроме того, что должны открыть
    $('#accordeon .acc-body').not($(this).next()).slideUp(10);
    // открываем или скрываем блок под заголовком, по которому кликнули
    $(this).next().slideToggle(10);
}


function tableSearch() {
    var phrase = document.getElementById('search-text'); //получаем значение поля формы
    var regPhrase = new RegExp(phrase.value, 'i'); //передаём в конструктор RegExp            
    if (regPhrase != "/(?:)/i") {
        $('.acc-body').slideDown(100); //скрыли строки
    } else {
        $('.acc-body').slideUp(100); //открыли скрытые строки
    } // сверка значения, если поле поиска пустое        	
    //$("table:nth-child(2)").attr("id", "no_accordeon");//переименовали id
    //var tab = document.getElementsByTagName("table");
    //tab[1].id = "no_accordeon"; //эквивалент предыдущей записи       	
    //$('.acc-body').slideDown(100);//открыли скрытые строки
    var table = document.getElementById('accordeon');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        //for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
        flag = regPhrase.test(table.rows[i].cells[0].innerHTML); //для поиска по всем ячейкам 0 заменить на j
        //if (flag) break;
        //}
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
    }
}
/*---Конструктор обьекта "материал"----------*/
/*function Material(name, C, Ni, Cr, Mo, P, Cu, Mn, W, V, Co, Si, Ti, Al, Nb, B, Zr, Ce, Se, S, N) {
    this.name = name; //вид
    this C = C; //
    this.Ni = Ni; //никель
    this.Cr = Cr; //хром
    this.Mo = Mo; //молибден
    this.P = P; //фосфор
    this.Cu = Cu; //медь
    this.Mn = Mn; //марганец
    this.W = W; //вольфрам
    this.V = V; //ванадий
    this.Co = Co; //кобальт
    this.Si = Si; //кремний
    this.Ti = Ti; //титан
    this.Al = Al; //алюминий
    this.Nb = Nb; //ниобий
    this.B = B; //бор
    this.Zr = Zr; //церий
    this.Ce = Ce; //церий
    this.Se = Se; //селен
    this.S = S; //сера
    this.N = N; //азот
}*/

$(function() {
    var i, j;
    var scrap = [];
    var him = [];
    var name_scrap = $(".acc-body tr");
    for (i = 0; i < name_scrap.length; i++) {
        var scrap_row = $(".acc-body tr").eq(i);
        var him = new Array(13);
        for (j = 0; j < 13; j++) {
            him[j] = scrap_row.children().eq(j).text();
            if (him[j] == "") {
                him[j] = 0;
            }
        }
        scrap[i] = him;
    }
    alert(scrap[4]);
});
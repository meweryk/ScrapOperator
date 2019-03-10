/*
god - необходимая масса годного по слиткам;
nedol - запланированный вес недоливка;
litn - запланированный вес литниковой системы;
scrap_r - запланированный вес потерь скрапа при разливке;
scrap_sh - запланированный вес потерь скрапа при скачивании шлака;
ugar - Плановый угар;
shih - необходимый вес шихты и ферросплавов для выплавки с учётом угара и отходов;
sum - массив суммарных данных по завалке в тоннах;
proc - массив суммарного процентного содержания легирующих элементов в завалке;
nedol - запланированный вес недоливка;
him - массив с данными химюсостава (верхняя, нижняя границы);['c', 'ni', 'cr', 'mo', 'p', 'cu', 'mn', 'w', 'v', 'co', 'si', 'ti', 'al', 'nb']
mess - строка со всплывающим сообщением;
plane - массив с плановыми занными (годное и отходы);
sum_proc_god - значение суммы процентного химсостава годного
click - регестратор нажатия кнопки "готово";
el_zav - элемент завалки массив(вес-химияб масса элемента);
zav - номер элемента завалки в массивеж;
pp - плановый вес жидкого металла ;
weight_pp - массив с весом полупродукта, весом верхней и нижней границы заданного по элементам
Prognoz - массив прогнозируемого веса элементов в расплаве
cham_aver - массив содержания ниже среднего хим. элементов в годном

pr_pr - массив прогнозируемого процентного содержания лег. эл в расплаве
cham_pp - массив с данными п/продукта (Взвешенная масса п/продукта, Ni, Cr, Mo, P, Cu, Mn, W, V, Co, Si, Ti, Al, Nb)
lom - массив с данными по добавляемому лому;
*/
/*globals $:false */

var window, d, document, god, nedol, litn, scrap_r, scrap_sh, ugar, sum, proc, him, mess, plane, sum_proc_god, weight, Pr, zav, el_zav, pp, weight_pp, Prognoz, cham_aver, cham_pp, q, q7;
d = document;
$(function() {
    $(window).ready(ChangeSize); // событие загрузки html, определяем размер окна таблицы
    $(window).resize(ChangeSize); // событие изменения окна браузера, определяем размер окна таблицы
});

function ChangeSize() {
    var ww = window.innerWidth; //ширина окна 
    var xy = ww;
    if (xy < 800) {
        xy = (xy - 12) + "px";
        d.getElementById("shih_mat").style.width = xy;
        //	d.getElementsByClass("form").style.width = xy;
    } //прокрутка если окно меньше 800px (для мобильных)
    /*var tw = $(".scrapgroup").width(); //ширина таблицы
    var ch = $("section").height(); //высота основного блока
    document.getElementById("scrap").style.width = tw + "px"; //установка ширины блока с таблицей
    $("#scrap").css("height", ((ch - 17) + "px")); //высота блока с шапкой и таблицей равна высоте основного контейнера                   
    $(".scroll").css("height", ((ch - 17) + "px")); //высота блока с таблицей                 
    $(".fixFox").css("width", (tw + "px")); //устанавливаем ширину блока с шапкой
    $(".scroll").css("width", ((tw + 17) + "px")); //устанавливаем ширину блока с таблицей
    if (ww < (tw + 17)) {
    	$(".content").css("width", (ww + "px")); //установка ширины в jquery            	
    } //прокрутка если окно меньше ширины окна (для мобильных)*/
}
sum = []; // массив суммарными данными по шихте
him = addCham();
plane = teor();
zav = -1;
el_zav = [];
weight_pp = [];
Prognoz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //массив прогнозируемого веса и содержания элементов
cham_pp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//Расчёт необходимой массы шихты и ферросплавов для выплавки заданного годного
function teor() {
    plane = []; // массив с плановыми данными (годное и отходы)
    var shih, kan, god_t;
    kan = d.forms.kanava;
    god = check(kan.elements.god.value); //Запланированный вес годного
    god_t = parseFloat((check(kan.elements.iz1.value) * check(kan.elements.izk1.value) + check(kan.elements.iz2.value) * check(kan.elements.izk2.value) + check(kan.elements.iz3.value) * check(kan.elements.izk3.value)).toFixed(2)); //расчёт суммарного развеса изложниц	
    d.getElementById("kanava").innerHTML = "Суммарный развес изложниц " + god_t + "т.";
    if (god_t < god && god_t > 0) {
        mess = "Суммарный развес изложниц " + god_t + "т меньше запланированного веса годного " + god + "т.";
        show('block', mess);
    }
    // Обработка данных по планируемым отходам в процессе плавки	
    nedol = parseFloat((god * check(kan.elements.nedol.value) / 1000).toFixed(3)); //запланированный вес недоливка
    var node = ". \(" + nedol + "т\)"; //создаём текстовый узел с недоливком
    d.getElementById("nedol").innerHTML = node; //изменяем элемент  с id 
    litn = parseFloat((god * check(kan.elements.litn.value) / 1000).toFixed(3)); //запланированный вес литниковой системы
    d.getElementById("litn").innerHTML = ". \(" + litn + "т\)";
    scrap_r = parseFloat((god * check(kan.elements.scrap_r.value) / 1000).toFixed(3)); //запланированный вес скрапа при разливке
    d.getElementById("scrap_r").innerHTML = ". \(" + scrap_r + "т\)";
    scrap_sh = parseFloat((god * check(kan.elements.scrap_sh.value) / 1000).toFixed(3)); //запланированный вес скрапа, потери со шлаком
    d.getElementById("scrap_sh").innerHTML = ". \(" + scrap_sh + "т\)";
    ugar = parseFloat((god * check(kan.elements.ugar.value) / 1000).toFixed(3)); //Плановый угар
    d.getElementById("ugar").innerHTML = ". \(" + ugar + "т\)";
    shih = parseFloat((god + nedol + litn + scrap_r + scrap_sh + ugar).toFixed(3));
    d.getElementById("resume").innerHTML = "Плановый вес металлотходов и ферросплавов для выплавки равен " + shih + "т";
    if (god_t > shih) {
        mess = "Суммарный развес изложниц " + god_t + "т превышает необхоимый на выплавку вес шихты " + shih + "т.";
        show('block', mess);
    }
    pp = (shih - ugar).toFixed(3); //плановый вес жидкого метатта при разливке
    if (god !== 0) {
        d.getElementById("min").getElementsByTagName("th")[1].innerHTML = pp;
    } //вводим вес планового жидкого в таблицу итог	
    plane = [shih, pp, god, nedol, litn, scrap_r, scrap_sh, ugar];
    return plane;
}

//расчёт массы элементов в жидком металле (прогноз по заданному)
function mass_pp() {
    var wpx, wpn, hzx, hzn, pp, i;
    hzx = []; //массив верхней границей химсостава заданного
    hzn = []; //массив нижней границей химсостава заданного
    wpx = []; //массив с верхней границей массы элементов заданного
    wpn = []; //массив с нижней границей массы элементов заданного
    hzx = him[0];
    hzn = him[1];
    if (check(god) === 0) {
        return 0;
    } //проверка ввода массы годного
    if (summa(hzx) === 0) {
        return 0;
    } //проверка ввода химсостава заданного
    pp = plane[1]; //вес жидкого полупродукта
    for (i = 0; i < hzx.length; i++) {
        wpx[i] = (pp * hzx[i] / 100).toFixed(3);
        wpn[i] = (pp * hzn[i] / 100).toFixed(3);
    }
    weight_pp = [pp, wpx, wpn]; //массив с весом полупродукта, весом верхней и нижней границы заданного по элементам
    return weight_pp;
}

function addRow() {
    weight_pp = mass_pp();
    var i, a, b, c, tbody, row, td, tfoot1, tfoot2, tf, k, him_zad_max, him_zad_min, u, pr_m, pr_pr, fe, pr_pp, z;
    a = ['vid', 'pl', 'm', 'zas', 'M', 'c', 'ni', 'cr', 'mo', 'p', 'cu', 'mn', 'w', 'v', 'co', 'si', 'ti', 'al', 'nb'];
    b = []; //массив с данными текущей формы
    c = []; //массив пересчёта данных формы на тонны
    u = []; //хим. элементы с превышением химсостава годного
    proc = []; //массив с суммарными процентами по шихте
    pr_m = []; // массив прогноз массы лег. элемента в материале с учётом усвоения
    pr_pr = []; // массив прогноз процентного содержания лег. эл в расплаве
    him_zad_max = him[0]; //массив с заданным химсоставом верхняя граница
    him_zad_min = him[1]; //массив с заданным химсоставом нижняя граница
    if (him_zad_max.length === 0) {
        mess = "Исправьте или очистите хим. состав заданного, суммарное содержание элементов превышает 100%";
        show('block', mess);
        return;
    } //обработка исключения по заданному
    b = addlom(); //получаем данные по весу добавки
    k = addCham_lom(); // получаем данные по хим.составу добавки
    // если содержание элементов в группе отходов введено неверно (>100%), прерываем функцию.
    if (k.length === 0 || k.length === 0) {
        b.length = 0;
        return;
    } //обработка исключений по материалу добавке
    b = b.concat(k); // заполненный массив с данными текущей формы
    // Считаем массу элемента соответствующую проценту в материале---------------------------
    for (i = 0; i < b.length; i++) {
        if (i < 2) {
            c[i] = "";
        } else if (i == 2 || i == 4) {
            c[i] = b[i];
        } else if (i == 3) {
            c[i] = parseFloat((b[2] * b[i] / 100).toFixed(3));
        } else {
            c[i] = parseFloat((b[4] * b[i] / 100).toFixed(3));
        }
    }
    var form = d.forms.add_material; //находим форму с добавлением материала
    var elem = form.elements.sh_f.value; //берём с формы значение радиокнопки (шихта или ферросплавы)
    var metod = form.elements.kc.value; //берём с формы значение метода выплавки для коэфициента усвоения
    var K_ass = select_K_ass(metod, elem); //получаем коэффициенты усвоения для материала
    // расчёт итогового веса и процентов в таблицу шихты и ферросплавов
    // Находим накопительные строки таблицы, записываем данные в массив
    tfoot1 = d.getElementById('all').getElementsByTagName('td');
    tfoot2 = d.getElementById('pr').getElementsByTagName('td');
    for (i = 0; i < tfoot1.length; i++) {
        tf = parseFloat(tfoot1[i].innerHTML); // преобразовываем тип строчный в номерной		
        sum[i] = parseFloat((tf + (c[i + 2])).toFixed(3)); //наращиваем значение и округляем до тысячных
        if ((i === 2) && (plane[1] != 0) && (sum[i] > plane[0])) {
            mess = "Общая масса завалки (" + sum[i] + "т) превышает массу шихты (" + plane[0] + "т), необходимую для выплавки " + god + "т годного. Изменить вес материала?";
            //Выводим сообщение обрабатываем запрос да-нет----------------------------------------------
            //var answer = show_YN('block', mess, 'n');
            //if (answer === 0) {return;}
            z = confirm(mess);
            if (z === true) {
                return;
            }
        }
        // заполняем массив с процентами
        if ((i === 7) && (sum[i] > 0)) {
            proc[i] = (100 * sum[i] / sum[2]).toFixed(3);
            u.push(Mess(him_zad_max[i - 3], proc[i], a[i + 2])); //добавляем значение в массив превышения химсостава
        } else if ((i > 2) && (sum[i] > 0)) {
            proc[i] = (100 * sum[i] / sum[2]).toFixed(2);
            u.push(Mess(him_zad_max[i - 3], proc[i], a[i + 2])); //добавляем значение в массив превышения химсостава 
        } else {
            proc[i] = "";
        }
    }
    // блок вывода предупреждения при вероятности превшения химсостава в марке----------------
    mess = "";
    for (i = 0; i < u.length; i++) {
        if (typeof u[i] == "string") {
            mess = mess + u[i];
        }
    }
    if (mess.length > 0) {
        z = confirm(mess + "Изменить данные?");
        if (z === true) {
            return;
        }
    }

    //Добавление табличных данных--------------------------------------------------------------
    // Находим таблицу
    tbody = d.getElementsByName(elem)[0];
    // Создаем строку таблицы для данных по добавляемому материалу (вес и проценты) и добавляем ее
    row = tbody.insertRow();
    for (i = 0; i < a.length; i++) {
        td = row.insertCell(i);
        // Наполняем ячейки с процентами
        if (i < 2) {
            td.innerHTML = b[i];
        } else if (i === 2 || i === 4) {
            td.innerHTML = b[i].toFixed(3) + "т";
        } else if (((i == 3) || (i > 4)) && (b[i] > 0)) {
            td.innerHTML = b[i] + "%";
        }
    }
    // Создаем строку таблицы для веса и добавляем ее
    row = tbody.insertRow();
    for (i = 0; i < a.length; i++) {
        td = row.insertCell(i);
        // Наполняем ячейки если в них есть значения веса в тоннах
        if ((i === 3 || i > 4) && c[i] > 0) {
            td.innerHTML = c[i] + "т";
        }
    }
    //наполняем итоговые строки------------------------------------------------------------------
    for (i = 0; i < tfoot1.length; i++) {
        if (i > 2 && sum[i] > 0) {
            tfoot2[i].innerHTML = proc[i] + "%"; //меняем значение % в столбце строки на новое
        }
        // заполняем строку с суммой
        if (sum[i] > 0) {
            tfoot1[i].innerHTML = sum[i]; //меняем значение в столбце строки на новое
        }
    }

    fe = 100 - summa(k); //процент железа в полупродукте
    pr_pp = parseFloat((c[4] * fe * 0.939 / 100).toFixed(3)); //прогноз массы материала добавки (железо)
    for (i = 5; i < c.length; i++) {
        pr_m[i - 5] = parseFloat((c[i] * K_ass[i - 5]).toFixed(3));
        pr_pp = parseFloat((pr_pp + pr_m[i - 5]).toFixed(3)); //прогноз массы материала добавки
    }
    Prognoz[0] = parseFloat((Prognoz[0] + pr_pp).toFixed(3)); //прогноз массы полупродукта
    for (i = 1; i < Prognoz.length; i++) {
        Prognoz[i] = parseFloat((Prognoz[i] + pr_m[i - 1]).toFixed(3)); //итоговые веса суммы добавок с учётом усвоения;
        if (i === 5) {
            pr_pr[i - 1] = parseFloat((100 * Prognoz[i] / Prognoz[0]).toFixed(3));
        } else {
            pr_pr[i - 1] = parseFloat((100 * Prognoz[i] / Prognoz[0]).toFixed(2));
        }
    }
    //Prognoz - массив с прогнозируемым весом полупродукта и массой легирующих элементов
    //pr_pr - массив с прогнозируемым содержанием легирующих в полупродукте

    //Наполняем строку "Прогноз" в таблице "итог: план-факт"
    d.getElementById('prognoz').getElementsByTagName('th')[1].innerHTML = Prognoz[0] + "т";
    for (i = 0; i < pr_pr.length; i++) {
        if (pr_pr[i] !== 0) {
            d.getElementById('prognoz').getElementsByTagName('td')[i].innerHTML = pr_pr[i] + "%";
            if (pr_pr[i] >= him_zad_max[i]) {
                d.getElementById('prognoz').getElementsByTagName('td')[i].style.background = "#FF7F50";
            } else if (pr_pr[i] <= him_zad_min[i]) {
                d.getElementById('prognoz').getElementsByTagName('td')[i].style.background = "#ADFF2F";
            } else {
                d.getElementById('prognoz').getElementsByTagName('td')[i].style.background = "none";
            }
        }
    }

    zav = zav + 1;
    el_zav[zav] = [b, c, elem]; //итоговый массив с данными по добавляемому материалу (вид-процент, вес элементов. шихта или ферро)
    return;
}

/*создание массива с данными заданного хим.состава*/
function addCham() {
    var cham_max, cham_min;
    cham_max = []; //массив с верхней границей хим. элементов
    cham_min = []; //массив с нижней границей хим. элементов
    cham_aver = []; //массив содержания ниже среднего хим. элементов
    var cham_el = ['c', 'ni', 'cr', 'mo', 'p', 'cu', 'mn', 'w', 'v', 'co', 'si', 'ti', 'al', 'nb']; // массив с названием хим.элементов
    for (var i = 0; i < cham_el.length; i++) {
        cham_max.push(check(d.getElementById(cham_el[i] + "_max").value)); //добавили элемент в конец массива
        cham_min[i] = check(d.getElementById(cham_el[i] + "_min").value); //добавили элемент в конец массива
        if (cham_min[i] !== 0) {
            cham_aver[i] = ((7 * cham_min[i] + 3 * cham_max[i]) / 10).toFixed(2);
        } else {
            cham_aver[i] = cham_max[i];
        }
    }
    sum_proc_god = summa(cham_max);
    if (sum_proc_god > 100) {
        mess = "Содержание легирующих элементов в верхней границе годного " + sum_proc_god + "% превышает 100%, откорректируйте хим. состав";
        show('block', mess);
        for (i = 0; i < cham_max.length; i++) {
            cham_min[i] = 0;
            cham_max[i] = 0;
            cham_aver[i] = 0;
        } //обнуление массива
        return;
    } //проверка на содержание хим. элементов больше 100%
    var sum_proc = summa(cham_min);
    if (sum_proc > 100) {
        mess = "Содержание легирующих элементов в нижней границе годного " + sum_proc + "% превышает 100%, откорректируйте хим. состав";
        show('block', mess);
        for (i = 0; i < cham_max.length; i++) {
            cham_min[i] = 0;
            cham_max[i] = 0;
            cham_aver[i] = 0;
        } //обнуление массива
        return;
    } //проверка на содержание хим. элементов больше 100%
    for (i = 0; i < cham_max.length; i++) {
        if (cham_max[i] < cham_min[i]) {
            mess = "Исправьте введённый хим. состав. Верхняя граница меньше  или равна нижней.";
            show('block', mess);
            for (i = 0; i < cham_max.length; i++) {
                cham_min[i] = 0;
                cham_max[i] = 0;
                cham_aver[i] = 0;
            } //обнуление массива
            return;
        }
    } //проверка на превышение нижней границы верхней
    him = [cham_max, cham_min, cham_aver]; //массив с данными химюсостава (верхняя, нижняя границы)
    //обрабатываем исключения
    //наполняем таблицу если удовлетворяет условиям.
    var tbody_itog1 = d.getElementById('max').getElementsByTagName('td');
    var tbody_itog2 = d.getElementById('min').getElementsByTagName('td');
    for (i = 0; i < tbody_itog1.length; i++) {
        if (cham_max[i] > 0) {
            tbody_itog1[i].innerHTML = cham_max[i] + "%"; //меняем значение % в столбце строки на новое
        } else {
            tbody_itog1[i].innerHTML = " "; //если значение = 0 пустое поле
        }
        if (cham_min[i] > 0) {
            tbody_itog2[i].innerHTML = cham_min[i] + "%"; //м0еняем значение % в столбце строки на новое
        } else {
            tbody_itog2[i].innerHTML = " ";
        }
    }
    return him;
}

/* Считываем значения с формы, создание массива с данными по добавляемому лому( вес, партия, засор)*/
function addlom() {
    var lom = []; //массив с данными по добавляемому лому
    var lom_el = ['vid', 'pl', 'm', 'zas', 'M']; // массив с названием иденгификаторов партии лома
    for (var i = 0; i < lom_el.length - 1; i++) {
        if ((i == 2) || (i == 3)) {
            lom.push(parseFloat(d.getElementById(lom_el[i]).value));
        } else {
            lom.push(d.getElementById(lom_el[i]).value); //добавили элемент в конец массива
        }
    }
    lom[4] = (lom[2] * (100 - lom[3])).toFixed(3) / 100; // высчитывает массу отходов с учётом снятия засорённости и округляет до 3 знака
    if (lom[2] === 0) {
        mess = "Введите действительный вес, масса в тоннах > 0";
        show('block', mess);
        lom.length = 0;
    }
    return lom;
}

/*создание массива с данными хим.состава по добавляемому материалу*/
function addCham_lom() {
    var cham = []; //массив с содержанием хим. элем.    
    var cham_el = ['c', 'ni', 'cr', 'mo', 'p', 'cu', 'mn', 'w', 'v', 'co', 'si', 'ti', 'al', 'nb']; // массив с названием хим.элементов
    for (var i = 0; i < cham_el.length; i++) {
        cham.push(check(d.getElementById(cham_el[i]).value)); //добавили элемент в конец массива		
    }
    var sum_proc = summa(cham);
    if (sum_proc > 100) {
        mess = "Содержание легирующих элементов в материале " + sum_proc + "% превышает 100%, откорректируйте хим. состав";
        show('block', mess);
        cham.length = 0;
    } //проверка на содержание хим. элементов больше 100%
    return cham; //возвращаем массив с химсоставом материала cham[]
}

/*создание массива с данными по взвешенному полупродукту*/
function addItog() {
    var itog, i, cham_pp_m, him_zad_max, him_zad_min, delta;
    var cham_el = ['C', 'Ni', 'Cr', 'Mo', 'P', 'Cu', 'Mn', 'W', 'V', 'Co', 'Si', 'Ti', 'Al', 'Nb']; // массив с названием хим.элементов
    cham_pp = []; //массив : вес п/продукса + химсостав %
    cham_pp_m = []; //массив : вес п/продукта + вес хим.элементов
    delta = []; //массив : угар + дельта по массе элементов
    him_zad_max = him[0];
    him_zad_min = him[1];
    itog = d.forms.itog; //обьект со значениями с формы itog
    cham_pp = addChamic(itog); //Получаем массив (Взвешенная масса п/продукта, C, Ni, Cr, Mo, P, Cu, Mn, W, V, Co, Si, Ti, Al, Nb)
    if (cham_pp[0] !== 0) {
        d.getElementById('fact').getElementsByTagName('th')[1].innerHTML = cham_pp[0] + "т";
        for (i = 1; i < cham_pp.length; i++) {
            if (cham_pp[i] !== 0) {
                d.getElementById('fact').getElementsByTagName('td')[i - 1].innerHTML = cham_pp[i] + "%";
                if ((cham_pp[i] >= him_zad_max[i - 1]) && (him_zad_max[i - 1] !== 0)) {
                    d.getElementById('fact').getElementsByTagName('td')[i - 1].style.background = "#FF7F50";
                } else if (cham_pp[i] <= him_zad_min[i - 1]) {
                    d.getElementById('fact').getElementsByTagName('td')[i - 1].style.background = "#ADFF2F";
                } else {
                    d.getElementById('fact').getElementsByTagName('td')[i - 1].style.background = "none";
                }
            }
        }
    }
    cham_pp_m[0] = cham_pp[0]; //вес жидкого полупродукта
    for (i = 1; i < cham_pp.length; i++) {
        cham_pp_m[i] = (cham_pp[0] * cham_pp[i] / 100).toFixed(3); //масса элементов в жидком
    }
    if (sum.length === 0) {
        return;
    }
    //расчёт угара и разбаланса элементов
    delta[0] = ((sum[2] - cham_pp_m[0]) * 100 / sum[2]).toFixed(1); // угар%, сверхугар, разбаланс элементов
    mess = "Угар (" + delta[0] + "%), баланс металла: ";
    for (i = 1; i < cham_pp_m.length; i++) {
        delta[i] = (Prognoz[i - 1] - cham_pp_m[i - 1]).toFixed(3);
        if ((i == 1) && (delta[i] <= 0)) {
            mess = mess + "экономия по угару " + (-delta[i]) + "т.";
        } else if ((i == 1) && (delta[i] > 0)) {
            mess = mess + "сверхугар " + delta[i] + "т.";
        }
        if ((Prognoz[i - 1] !== 0) && (((i > 2) && (i < 6)) || ((i > 8) && (i < 12))) && (delta[i] <= 0)) {
            mess = mess + ", экономия " + cham_el[i - 2] + "=" + (-delta[i]) + "т.";
        } else if ((Prognoz[i - 1] !== 0) && (((i > 2) && (i < 6)) || ((i > 8) && (i < 12))) && (delta[i] > 0)) {
            mess = mess + ", разбаланс " + cham_el[i - 2] + "=" + delta[i] + "т.";
        }
    }
    show('block', mess);
}

function compare() {
    var i, d_pr, d_m, cham_el, f_splav, mass_fs, fs;
    cham_el = ['C', 'Ni', 'Cr', 'Mo', 'P', 'Cu', 'Mn', 'W', 'V', 'Co', 'Si', 'Ti', 'Al', 'Nb'];
    d_pr = []; //массив разницы % содержания элементов в заданном и полупродукте
    d_m = []; //массив разницы массы содержания элементов в заданном и полупродукте
    mass_fs = []; //массив с данными по добавляемым ферросплавам
    fs = []; // массив добавляемого ферросплава
    for (i = 0; i < cham_aver.length; i++) {
        d_pr[i] = cham_pp[i + 1] - cham_aver[i];
        if (d_pr[i] < 0) {
            d_m[i] = (d_pr[i] * cham_pp[0] / 100).toFixed(3);
        } else {
            d_m[i] = 0;
        }
    }
    alert(d_m);
}

var col = 0; //количество рассчитываемых добавок ферросплавов
function ferrosplav() {
    col++;
    var i, f_splav, mass_fs, fs;
    fs = new Array(21);
    f_splav = d.forms.fsplav; //обьект со значениями с формы fsplav для расчёта ферросплавов
    for (i = 0; i < f_splav.elements.length - 2; i++) {
        if ((i === 0) || (i === 3) || (i === 4)) {
            fs.push(f_splav.elements[i].value); //сняли данные с формы и добавили элемент в конец массива
        } else if (i === 1) {
            fs.push(f_splav.elements.sh_f.value);
            i++;
        } else if (i === 6) {
            fs.push(check(f_splav.elements[i].value));
            fs.push((fs[4] * (1 - fs[5] / 100)).toFixed(3));
        } else {
            fs.push(check(f_splav.elements[i].value));
        } //[способ, вид, название, партия, масса, засор, масса без засора, 'C', 'Ni', 'Cr', 'Mo', 'P', 'Cu', 'Mn', 'W', 'V', 'Co', 'Si', 'Ti', 'Al', 'Nb'] всего 21 элемент (0....20)
    }
    alert(fs);
    var x = 0; //сумма элементов
    for (var i = 7; i < fs.length; i++) {
        x += fs[i];
    }
    alert(x);
    if (x > 100) {
        mess = "Содержание легирующих элементов в материале " + x + "% превышает 100%, откорректируйте хим. состав";
        alert(mess);
        show('block', mess);
        fs.length = 0;
        nom.length--;
        alert(nom);
    } //проверка на содержание хим. элементов больше 100%*/
}
/*--1 создание массива с данными хим.состава полупродукта (все элементы по порядку в форме кроме кнопок)*/
function addChamic(obg1) {
    var cham;
    cham = []; //массив с содержанием хим. элем.  
    for (var i = 0; i < obg1.elements.length - 2; i++) {
        cham.push(check(obg1.elements[i].value)); //сняли данные с формы и добавили элемент в конец массива	
    }
    var sum_proc = summa(cham) - cham[0];
    if (sum_proc > 100) {
        mess = "Содержание легирующих элементов в материале " + sum_proc + "% превышает 100%, откорректируйте хим. состав";
        show('block', mess);
        cham.length = 0;
    } //проверка на содержание хим. элементов больше 100%
    return cham; //возвращаем массив с химсоставом материала cham[]
}

/*------------Обратотка исключений-------------------------------------------------------------------*/
//проверка на число, если не число или пустое поле или не объявлено (undefinded) - возвращает 0
function check(n) {
    if ((n !== n) || (n === "") || (parseFloat(n) !== parseFloat(n))) {
        return 0;
    } //обработка исключений, не число и пустое поле в форме
    return parseFloat(n);
}

//сумма процентов по элементам в материале для проверки на содержание хим. элементов  больше 100%
function summa(y) {
    var x = 0;
    for (var i = 0; i < y.length; i++) {
        x += y[i];
    }
    return x;
}

//проверка превышения химсостава добавки по отношению к заданному
function Mess(zn1, zn2, zn3) {
    zn3 = zn3.toLocaleUpperCase();
    if ((sum_proc_god > 0) && (zn2 > zn1)) {
        mess = zn3 + "=" + zn2 + "% в завалке превышает заданное " + zn1 + "%. ";
        return mess;
    }
    return;
}

/*------------Функция показа сообщений----------------------------------------------------------------*/
function show(state, mess) {
    if (state == 'none') {
        div = d.getElementById('alert_mess');
        div.parentNode.removeChild(div);
    } else {
        var div = d.createElement("div");
        div.className = "alert alert-success";
        div.id = "alert_mess";
        div.innerHTML = mess;
        d.getElementById("mess").insertBefore(div, d.getElementById("mess").firstChild);
        mess = "";
    }
    d.getElementById('window').style.display = state;
    d.getElementById('wrap').style.display = state;
}

/*функция подбора коэффициентов усвоения в зависимости от метода выплавки и вида материала-------------*/
function select_K_ass(method, material) {
    //-------------C----Ni----Cr----Mo----P-----Cu----Mn----W----V----Co---Si--Ti---Al---Nb, B, Zr, Ce, Se, S, N)
    var K_ass1 = [0.3, 0.98, 0.80, 0.90, 0.3, 0.95, 0.55, 0.9, 0.1, 0.97, 0.1, 0.1, 0.1, 0.5]; //окисление, шихта
    var K_ass2 = [0.3, 0.98, 0.87, 0.93, 0.3, 0.97, 0.95, 0.95, 0.1, 0.97, 0.1, 0.1, 0.1, 0.5]; //окисление, ферроспл.
    var K_ass3 = [0.8, 0.98, 0.95, 0.95, 0.97, 0.95, 0.90, 0.9, 0.6, 0.97, 0.7, 0.8, 0.1, 0.8]; //переплав, шихта
    var K_ass4 = [0.8, 0.98, 0.95, 0.97, 0.97, 0.97, 0.95, 0.95, 0.95, 0.97, 0.7, 0.65, 0.75, 0.95]; //переплав, ферроспл.
    var K_ass5 = [0.9, 0.97, 0.85, 0.97, 0.97, 0.97, 0.80, 0.95, 0.85, 0.97, 0.8, 0.7, 0.7, 0.95]; //индукц, шихта
    var K_ass6 = [0.9, 0.97, 0.95, 0.99, 0.97, 0.97, 0.90, 0.95, 0.95, 0.97, 0.95, 0.9, 0.75, 0.95]; //индукц, ферроспл.
    if (method == 1 && material == "shiht") {
        return K_ass1;
    } else if (method == 1 && material == "fert") {
        return K_ass2;
    } else if (method == 2 && material == "shiht") {
        return K_ass3;
    } else if (method == 2 && material == "fert") {
        return K_ass4;
    } else if (method == 3 && material == "shiht") {
        return K_ass5;
    } else {
        return K_ass6;
    }
}



/*---Обязательно когда нибудь пригодится-----------------------------------------------------------------*/
/*добавляет функцию для нажатия кнопки к обработчику событий, используя Javascript------------------------*/
var el = d.getElementById("next");
if (el.addEventListener) {
    el.addEventListener("click", addWeight, false);
} else if (el.attachEvent) {
    el.attachEvent('onclick', addWeight);
}

function addWeight() {
    var K_ass = [0.939, 0.2, 0.98, 0.95, 0.8, 0.9, 0.97, 0.95, 0.9, 0.7, 0.9, 0.97]; //Ni assimilation (усвоение элементов при плавлении)
    weight = [];
    Pr = [];
    for (var i = 0; i < K_ass.length; i++) {
        weight[i] = (K_ass[i] * sum[i + 2]).toFixed(3);
        if (i > 0) {
            Pr[i] = (100 * weight[i] / weight[0]).toFixed(3);
        }
    }
}

/*------------Функция показа сообщений ДА-НЕТ----------------------------------------------------------*/
/*function show_YN(state, mess, answer) {
	if (state == 'none') {
		div = d.getElementById('alert_mess_YN');
		div.parentNode.removeChild(div);
	} else {
		var div = d.createElement("div");
		div.className = "alert_YN alert-success";
		div.id = "alert_mess_YN";
		div.innerHTML = mess;
		d.getElementById("mess_YN").insertBefore(div, d.getElementById("mess_YN").firstChild);
		mess = "";
	}
	d.getElementById('window_YN').style.display = state;
	d.getElementById('wrap_YN').style.display = state;
	if (answer == 'n') {
		return 0;
	} else if (answer == 'y') {
		return 1;
	} else {
		return 0;
		}
	
}*/

/*--2 создание массива с данными хим.состава полупродукта (все элементы с одним именем имени в форме)*/
/*function addChamic(obg1) {
	var cham, cham_pp;
	cham = []; //массив с содержанием хим. элем.  
	cham_pp = [];
	cham_pp = obg1.elements.cham_el;
	for (var i = 0; i < cham_pp.length; i++) {		
		cham.push(check(cham_pp[i].value)); // сняли данные с формы и добавили элемент в конец массива	
	}
	var sum_proc = summa(cham);
	if (sum_proc > 100) {
		mess = "Содержание легирующих элементов в материале " + sum_proc + "% превышает 100%, откорректируйте хим. состав";
		show('block', mess);
		cham.length = 0;
	} //проверка на содержание хим. элементов больше 100%
	return cham; //возвращаем массив с химсоставом материала cham[]
}*/



q = 0;
q7 = 0;
//--Вывод окна ввода химсостава годного------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#chamgod_bg").click(function() { // Событие клика на затемненный фон	   
        $("#chamgod").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $("#ready").click(function() { // Событие клика на "добавить"	   
        $("#chamgod").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон	   
        $("#chamgod").fadeOut(500); // Медленно убираем всплывающее окно
    });
});

function showPopup() {
    $(".form").css("width", "14rem");
    $(".legend").css("width", "14rem");
    $(".close_ready").css("margin-left", "12.5rem");
    $(".chami").css("width", "14rem");
    $(".chami").css("grid-template-rows", "repeat(14, 1fr)");
    $(".chami").css("grid-template-columns", "1fr 3fr 3fr");
    $(".izl").css("grid-template-rows", "1fr");
    $(".izl").css("width", "14rem");
    $("#chamgod").fadeIn(500); // Медленно выводим изображение
}

//-1--Вывод окна ввода плавки--------------------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#plavka_bg").click(function() { // Событие клика на затемненный фон	   
        $("#plavka").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон	   
        $("#plavka").fadeOut(500); // Медленно убираем всплывающее окно
    });
});

function showPopup1() {
    $(".form").css("width", "14rem");
    $(".close_ready").css("margin-left", "12.5rem");
    $("#plavka").fadeIn(500); // Медленно выводим изображение
}

//-2--Вывод окна расчёта массы завалки--------------------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#kanav_bg").click(function() { // Событие клика на затемненный фон	   
        $("#kanav").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон	   
        $("#kanav").fadeOut(500); // Медленно убираем всплывающее окно		
    });
});

function showPopup2() {
    $(".form").css("width", "17rem");
    $(".legend").css("width", "17rem");
    $(".close_ready").css("margin-left", "15.5rem");
    $(".chami").css("width", "17rem");
    $(".izl").css("width", "17rem");
    $(".chami").css("grid-template-rows", "repeat(1, 1fr)");
    $(".chami").css("grid-template-columns", "1fr 1fr");
    $(".cham").css("text-align", "center");
    $("#kanav").fadeIn(500); // Медленно выводим изображение
}

//-3--Вывод окна добавки материала --------------------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#material_bg").click(function() { // Событие клика на затемненный фон	   
        $("#material").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон	   
        $("#material").fadeOut(500); // Медленно убираем всплывающее окно
    });
});

function showPopup3() {
    $(".form").css("width", "14rem");
    $(".legend").css("width", "14rem");
    $(".close_ready").css("margin-left", "12.5rem");
    $(".chami").css("width", "14rem");
    $(".chami").css("grid-template-rows", "repeat(13, 1fr)");
    $(".chami").css("grid-template-columns", "1fr 1fr");
    $("#material").fadeIn(500); // Медленно выводим изображение
}

//-4--Вывод таблицы шихтовые материалы --------------------------------------------------------------
function showPopup4() {
    if (q === 0) {
        $("#shih_mat").fadeIn(500); // Медленно выводим изображение
        q = 1;
    } else {
        $("#shih_mat").fadeOut(500); // Медленно выводим изображение
        q = 0;
    }
}

//-5--Вывод окна ввода данных полупродукта------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#add_pp_bg").click(function() { // Событие клика на затемненный фон	   
        $("#add_pp").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон	   
        $("#add_pp").fadeOut(500); // Медленно убираем всплывающее окно
    });
});

function showPopup5() {
    $(".form").css("width", "14rem");
    $(".legend").css("width", "14rem");
    $(".close_ready").css("margin-left", "12.5rem");
    $(".chami").css("width", "14rem");
    $(".chami").css("grid-template-rows", "repeat(8, 1fr)");
    $(".chami").css("grid-template-columns", "1fr 1fr");
    $("#add_pp").fadeIn(500); // Медленно выводим изображение
}

//-6--Вывод окна ввода химсостава ферросплавов------------------------------------------------
$(function() { // Ждём загрузки страницы
    $("#material_ferro_bg").click(function() { // Событие клика на затемненный фон	   
        $("#material_ferro").fadeOut(500); // Медленно убираем всплывающее окно
        nom.length = nom.length - 1;
    });
    $("#ready_fer").click(function() { // Событие клика на "добавить"
        $("#material_ferro").fadeOut(500); // Медленно убираем всплывающее окно
    });
    $(".close_ready").click(function() { // Событие клика на затемненный фон
        $("#material_ferro").fadeOut(500); // Медленно убираем всплывающее окно
        nom.length = nom.length - 1;
    });
});

var nom = []; //порядковый номер рассчитываемого элемента добавки

function showPopup6(j) {
    $(".form").css("width", "14rem");
    $(".legend").css("width", "14rem");
    $(".close_ready").css("margin-left", "12.5rem");
    $(".chami").css("width", "14rem");
    $("#material_ferro .chami div:eq(0)").css("display", "none");
    $("#material_ferro .chami div:eq(1)").css("display", "none");
    $("#material_ferro .chami div:eq(6)").css("display", "none");
    $("#material_ferro .chami div:eq(7)").css("display", "none");
    $("#material_ferro .chami div:eq(8)").css("display", "none");
    $("#material_ferro .chami div:eq(9)").css("display", "none");
    $(".chami").css("grid-template-rows", "repeat(10, 1fr)");
    $(".chami").css("grid-template-columns", "1fr 1fr");
    $("#material_ferro").fadeIn(500); // Медленно выводим изображение
    //$("#material_ferro .chami div:eq(j) input").attr("value", j);
    nom.push(check(j)); //добавили элемент в конец массива 
    alert(nom);
}

//-7--Вывод кнопок для расчёта ферросплавов --------------------------------------------------------------
function showPopup7() {
    if (q7 === 0) {
        $("#ferros").fadeIn(500); // Медленно выводим изображение
        q7 = 1;
    } else {
        $("#ferros").fadeOut(500); // Медленно выводим изображение
        q7 = 0;
    }
}
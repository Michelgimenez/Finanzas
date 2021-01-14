// Dentro de esta variable tengo una funcion que es IFEE es decir que se llama inmediatamente al iniciarse la aplicacion. Y lo que hace esta funcion es primero crear una class llamada COMMUN y esta dentro recibe varios argumentos que luego los establece como fields en esta class. Basicamente estoy recibiendo la informacion del ingreso/gasto que quiero almacenar y creo varios fields que contengan esa informacion. Despues esta class va a ser simplemente para usarla de base las diferentes clases que voy a tener, por ejemplo la clase de los gasto/EXPENSE. Esta va a ser una extension de COMMUN, de esa forma en la class de GASTO esta class va a ser la que recibe toda la informacion de lo que quiero agregar como ingreso, en el constructor. Despues al ser una extension tengo que llamar si o si a SUPER dentro del constructor, en este caso llamo a SUPER pasandole todo lo que recibi en el constructor. llamar a SUPER equivale a llamar a la class de COMMUN, y en este caso la estoy pasando toda la informacion, entonces la class de COMMUN lo que va a hacer es crear los fields como puedo ver en COMMUN, y darle de valor, lo que le envie en SUPER. De esa forma en la class de EXPENSE voy a recibir todos estos fields establecidos (id, description, value, etc) como resultado de llamar a SUPER y de esa forma tambien me ahorro el proceso de citar cada field y darle su valor con lo recibido en el constructor. Este mismo proceso se repite cuando agrego ingresos ya que tambien extiendo a COMMUN y llamo a SUPER. Retomando con la class de EXPENSE, el unico field que le establezco manualmente es el de PERCENTAGE que le doy -1, despues fuera del constructor tengo varios metodos que voy a explicar detalladamente mejor dentro de cada uno. Lo importante a enteder es que al tener como contenido una IIFE, es decir una funcion que se autoejecuta al iniciar la aplicacion. Lo que se va a almacenar en budgetController es el retorno de esta funcion, en este caso el objeto que tiene varios fields con diferentes funciones cada uno.
let budgetController = (() => {
  class Commun {
    constructor(id, description, value, datePrel, categorie = "Standard") {
      this.id = id;
      this.description = description;
      this.value = value;
      this.datePrel = datePrel;
      this.categorie = categorie;
    }
  }

  class Expense extends Commun {
    constructor(id, description, value, datePrel, categorie) {
      super(id, description, value, datePrel, categorie);
      this.percentage = -1;
    }

    // 1) Este metodo recibe el ingreso total que tuve y verifica que si el ingreso total es mayor a 0, entonces procedo hacer una cuenta donde divido el valor del gasto que cree por el ingreso total y lo multiplico por 100 para sacar el numero de porcentaje que representa ese gasto frente al ingreso total. Si tengo 100 de ingreso, y pongo de gasto 10, esto me daria 10% en el porcentaje ya que es lo que representa de gasto frente al ingreso y esto se almacena en el field de percentage. Caso contrario percentage va a ser -1 para evitar bugs.
    calcPercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
    }

    // 2) Este metodo simplemente da como retorno el valor que se almaceno en percentage(por ejemplo el 10% que dije antes)
    getPercentage() {
      return this.percentage;
    }
  }

  // Esta clase se encarga de simplemente recibir los valores del ingreso y usar SUPER para ahorrarme el proceso de establecer de los fields y sus valores.
  class Income extends Commun {
    constructor(id, description, value, datePrel, categorie) {
      super(id, description, value, datePrel, categorie);
    }
  }

  // Esta variable se encarga de calcular el total de los ingresos y los gastos. Lo primero que recibe es el type a calcular, por ejemplo el type deberia ser gasto/ingreso. Creo una variable llamada sum con valor de 0. Despues selecciono la variable de DATA que dentro tiene un objeto con varios fields. De esta variable selecciono el field de allItems que tiene un objeto con dos fields, los de gasto/ingreso, este field lo voy a seleccionar de forma dinamica en base al type que recibo en la funcion. Despues se supone que dentro de estos fields voy a tener justamente todos los items de lo gastado/ingresado, la idea es loopear sobre estos items, por ejemplo loopeo sobre los items de los ingresos y por cada item encontrado, hago que la variable de SUM, equivalga a SUM + el field de VALUE del item encontrado en el array, ese field contiene el numero del ingreso/gasto, de esa forma SUM comienza en 0, pero con cada numero encontrado voy sumando hasta que SUM tenga la suma total de gastos/ingresos. Y finalmente coloco en la variable de DATA, en el field de TOTALS, y nuevamente segun el type recibido en la funcion, selecciono de forma dinamica el gasto/ingreso y le doy como valor la suma total. Por defualt esos fields tienen 0, por eso al iniciar la aplicacion estan en 0.
  const calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  // Esta es la variable que almacena la informacion importante. Primero tengo un objeto que va a tener dos fields, uno para los ingresos y otro para gastos y estos contienen un array con los items de cada ingreso/gasto. Despues tengo el el field de total que muestra el valor total de los ingresos/gastos. Y despues tengo un field que me muestra el dinero total disponible, si tengo mas ingresos que gastos, va a ser positivo, caso contrario, negativo. Y finalmente el porcentaje que por default va a ser -1
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  // Finalmente en la funcion doy como retorno un objeto con varios fields que tienen dentro funciones anonimas que reciben informacion y que se encargan de manipular el DOM por ejemplo agregando el item del ingreso/gasto, etc. Pero detallo mejor dentro de cada metodo.
  return {
    // Este es el primer field del objeto y dentro tiene una funcion anonima que recibe informacion sobre el tipo de item (ingreso/gasto), la descripcion, el valor, la fecha y la cantidad como ingreso yo en el input. Creo dos variables vacias dentro. Y procedo a crear un nuevo ID primero corroborando que en la variable de DATA en el field de allItems, el tipo de item que quiero agregar, dentro del array la longitud sea mayor a 0. De esa forma se que estoy agregando por ejemplo el segundo item, entonces el id seria 1, ya que si es el primer item, le voy a dar por default un id de 0. Despues corroboro que se haya seleccionado una fecha, en caso de que no esto va a dar "NaN-NaN-NaN" como valor, asi que le doy un valor a la fecha de "--/--/--", despues procedo a crear un tipo de archivo en base al type recibido, si es gasto procedo a crear un nuevo item con la class de EXPENSE y le paso la informacion del item, esto me da como retorno un objeto con los fields establecidos y lo almaceno en la variable vacia de newItem. Despues procedo a colocar en la variable de data y el field de allItems, de forma dinamica selecciono el field de ingres/gasto y procedo a empujar sobre dentro del array este nuevo item. Y finalmente doy como retorno este nuevo item.
    addItem: (type, des, val, datep, cat) => {
      let newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // check date
      if (datep === "NaN-NaN-NaN") {
        datep = "--/--/--";
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val, datep, cat);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val, datep, cat);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    // Dentro de este field procedo tengo una funcion que recibe el type del item a eliminar y su id. Y procedo a crear dos variables vacias. Y procedo a decir que la variable de IDS va a equivaler a loopear sobre la variable de DATA, en el field de allItems, selecciono el type con lo recibido en la funcion, y procedo a usar MAP, por cada item encontrado dentro de type que va a ser el field de gasto/ingreso que si recuerdo tiene un array de items. Y por cada item retorno el id de estos. De esa forma IDS va a tener un array de ids de cada item. Y procedo a almacenar en la variable el index que tenga el id recibido en la funcion en el array que tengo en IDS. Si recibo el id 2, el index va a ser 2 tambien ya que los ids los cree comenzando desde 0 al igual que como los index que comienzan en 0. Entonces index va a equivaler a 2. Y procedo a verificar que si index no equivale a -1, entonces procedo a seleccionar el array nuevamente del field de ingreso/gasto de forma dinamica, y procedo a usar el metodo de arrays de SPLICE que es para eliminar items de un array y primero le paso el index apartir del cual quiero comenzar a eliminar items, en este caso apartir de donde del index del item que estoy eliminando y coloco 1 porque solo quiero eliminar ese item.
    deleteItem: (type, id) => {
      let ids, index;

      // id = 6
      //data.allItems[type][id]
      // ids = [1 2 4  8]
      // index = 3
      ids = data.allItems[type].map((current) => {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    // Dentro de este field tengo un metodo se encarga de calcular el dinero total disponible ya sea en negativo o en positivo. Dentro procedo a a llamar a las variables que tengo mas arriba enviandoles que quiero calcular los ingresos totales y los gastos totales. Y procedo a establecer en la variable de DATA en el field de BUDGET, el total de los ingresos menos los gastos. Si tengo de ingreso 100.000 y de gasto total 20000, seria 80.000 el total disponible. Y finalmente procedo a corroborar que si el total de los ingresos es mayor a 0, entonces procedo a calcular el porcentaje de lo gastado, seleccionando la variable de data y el field de percentage, y le doy de valor, la resta del gasto total - el ingreso total y el resultado multiplicado por 100, de esa forma recibo el porcentaje de gasto frente al ingreso total. Este porcentaje se va a mostrar en el gasto total, de esa forma se que ese gasto total que tengo representa tal porcentaje del ingreso total. Si tengo de ingreso total 45.000 y de gasto 4500, entonces es 10% de gasto frente al ingreso total.
    calculateBudget: () => {
      calculateTotal("exp");
      calculateTotal("inc");

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    //
    calculatePercentages: () => {
      // El objeto del gasto tiene acceso al metodo de calcPercentage ya que fue creado con la class de EXPENSE que le hizo heredar en el prototipo el metodo de calcPercentage. Entonces procedo a seleccionar el array de items de gastos que cree en DATA.ALLITEMS.EXP y mapeo para que por cada item encontrado llamo al metodo de calcPercentage enviandole el total de los ingresos. Y esto lo que hace es que por cada gasto que tengo, le calcula cuando equivale en porcentaje frente al ingreso total.
      data.allItems.exp.forEach((cur) => {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: () => {
      let allPerc = data.allItems.exp.map((cur) => {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    // Setting data into local storage
    storeData: function () {
      localStorage.setItem("data", JSON.stringify(data));
    },

    // Getting data from local storage
    getStoredData: function () {
      let localData = JSON.parse(localStorage.getItem("data"));
      return localData;
    },

    // Updating data structure from stored data
    updateData: function (storedData) {
      data.totals = storedData.totals;
      data.budget = storedData.budget;
      data.percentage = storedData.percentage;
    },
  };
})();

// UI CONTROLLER
// Esta es otra IIFE function que se llama al iniciarse la app y en este caso esta da como retorno un objeto con varios fields que contienen funciones anonimas que se encargan de actualizar el DOM con la informacion que se contiene en el BudgetController, entre ellas para eliminar un item del DOM, para actualizar los ingresos totales/gastos totales en el DOM, agregar items en el DOM, etc.
let UIController = (() => {
  // 1) Aca creo un objeto que simplemente tiene una propertie que describe cada elemento del html y dentro como valor tiene la class de este.
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputCategorie: ".add__categorie",
    inputValue: ".add__value",
    inputDate: ".add__date",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  // 2) Aca esta variable es bastante quilombera pero por lo que entiendo voy a explicarlo dentro de la funcion
  const formatNumber = (num, type) => {
    let numSplit, int, dec;

    // 1) Math.abs es para crear un numero absoluto, es decir si paso un numero negativo, ABS lo vuelve absoluto quitandole el negativo. Despues con toFixed me aseguro que los decimales del numero solo sean 2, de esa forma si tengo 20,000.00000, este queda en 20,000.00
    num = Math.abs(num);
    num = num.toFixed(2);

    // 2) Aca uso split para dividir el numero en donde haya un punto, de esa forma recibo el numero absoluto y por otro lado los decimales que van despues del punto. Esto lo almaceno en INT, despues uso IF para verificar que si el numero tiene una longitud mayor a 3, es decir, por ejemplo 2000, o 20000, entonces procedo a utilizar el metodo de substr() para extraer partes de este numero, primero especifico el comienzo que es 0, y despues el final, en este caso el final seria la longitud del numero, que por ejemplo 2000 seria 4, y le resto 3, esto me da 1, por lo tanto estoy extrayendo solo el primer numero que es 2, a esto le sumo una coma quedando en "2,", y procedo a usar substr nuevamente sobre la variable que tiene el numero y procedo a establecer que comienzo en la longitud del numero (4) - 3, entonces esto me da 1, asi que estoy comenzando en el segundo numero de 2000, es decir el segundo cero, y termino en la longitud total del numero (4), entonces estoy seleccionando desde el segundo 0 hasta el ultimo 0 (000), entonces basicamente ahora la variable INT equivale a sumar 2 + "," + "000" = 2,0000. Y esto mismo aplica a cualquier numero mayor con una longitud mayor a 3, ya que un numero con longitud de 3 como 400, no tiene sentido ponerle una coma.
    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    // 3) En DEC almaceno la seleccion del segundo elemento del array de numSplit que si recuerdo contiene los decimales del numero.
    dec = numSplit[1];

    // 4) Y finalmente doy como retorno que si el type es EXPENSE, entonces creo una variable llamada SIGN que contiene el signo menos, caso contrario el signo mas. Y despues a esta string procedo a sumarle un espacio, despues el numero absoluto que tengo en int (2,000 si sigo el ejemplo que venia contando en el paso 2), despues le sumo un punto y finalmente la variable que contiene los decimales, entonces dando como retorno finalmente "+ 2,000.00" o "- 2,000.00"
    return (
      (type === "exp" ? (sign = "-") : (sign = "+")) + " " + int + "." + dec
    );
  };

  // 3) Esta variable basicamente contiene una funcion que dentro recibe por un lado una lista de elementos, esta puede ser por ejemplo la lista de inputs para que por ejemplo cuando cambio el type del item a crear a "gasto", entonces todos los inputs se actualizan utilizando un loop que va a loopear en base a la lista de items, en este caso recibi la lista de inputs, y por cada uno que encuentra llamo a la callbackFunction que recibi en el segundo argumento pasandole primero el item en el que me encuentro de la lista y segundo el numero del index que comienza en 0. Y por otro lado tambien se recibe en otro caso, la lista de gastos y se aplica el mismo proceso de loopear sobre los elementos de la lista y llamando a la callback recibida, pasandole el elemento de la lista que me encuentro loopeando y el index. Y de esta forma se actualizan los porcentajes de los gastos en cada lugar donde haya un gasto.
  const nodeListForEach = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  // 4) Este es el objeto que doy como retorno y que se va a almacenar en la variable de UIcontroller, teniendo dentro varios fields con funciones anonimas que permiten agregar items al dom, eliminar items del dom, actualizar los ingresos/gastos totales en el dom, etc. Pero explico mas en detalle cada field
  return {
    // 1) Primero tengo el field de getInput que da como retorno un objeto donde simplemente obtengo los valores ingresados en el input antes de ser agregado el item. Lo mas importante es donde obtengo el valor del numero ingresado, que uso parseFlotad para convertir en decimal el numero y eso me permite calcular el dinero disponible, etc. Y por otro lado lado la fecha, que para darle un buen formato, creo una nueva fecha donde le paso de valor, el valor del input, esto crea una fecha y de esta obtengo el dia. A esto le sumo un guion y procedo a repetir el mismo proceso pero obtengo solo el mes. Despues sumo otro guion y en por ultimo obtengo el ano.
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value), // ParseFloat, convert in decimal and allow to calculate budget
        datePrel:
          new Date(
            document.querySelector(DOMstrings.inputDate).value
          ).getDate() +
          "-" +
          new Date(
            document.querySelector(DOMstrings.inputDate).value
          ).getMonth() +
          "-" +
          new Date(
            document.querySelector(DOMstrings.inputDate).value
          ).getFullYear(),
        categorie: document.querySelector(DOMstrings.inputCategorie).value,
      };
    },

    // 2) Aca es donde agrego el item al DOM. Primero recibiendo el objeto que contiene los detalles del item y por otro lado el type del item. Creo 3 variables vacias, y procedo a chequear con IF el type, en caso de ser INCOME procedo a seleccionar el elemento html que tengo en la variable de "DOMstrings" que contiene la class del div de los INCOMES (incomeContainer) y esta class la almaceno en ELEMENT. Despues en la variable de HTML creo el DIV del INCOME colocandole la informacion de forma dinamica.
    addListItem: (obj, type) => {
      let html, newHtml, element;

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${
          obj.id
        }"><div class="item__badge ${
          obj.categorie === "Importante"
            ? "importante"
            : obj.categorie === "Comida"
            ? "comida"
            : obj.categorie === "Regalo"
            ? "regalo"
            : obj.categorie === "Venta"
            ? "venta"
            : obj.categorie === "Compra"
            ? "compra"
            : obj.categorie === "Pago deuda"
            ? "pago-deuda"
            : obj.categorie === "Trabajo"
            ? "trabajo"
            : obj.categorie === "Inversion"
            ? "inversion"
            : obj.categorie === "Algo inesperado"
            ? "algo-inesperado"
            : "otro"
        }">${obj.categorie}</div><div class="item__date">${
          obj.datePrel
        }</div><div class="item__description">${
          obj.description
        }</div><div class="right clearfix"><div class="item__value">${formatNumber(
          obj.value,
          type
        )}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-${
          obj.id
        }"><div class="item__badge ${
          obj.categorie === "Importante"
            ? "importante"
            : obj.categorie === "Comida"
            ? "comida"
            : obj.categorie === "Regalo"
            ? "regalo"
            : obj.categorie === "Venta"
            ? "venta"
            : obj.categorie === "Compra"
            ? "compra"
            : obj.categorie === "Pago deuda"
            ? "pago-deuda"
            : obj.categorie === "Trabajo"
            ? "trabajo"
            : obj.categorie === "Inversion"
            ? "inversion"
            : obj.categorie === "Algo inesperado"
            ? "algo-inesperado"
            : "otro"
        }">${obj.categorie}</div><div class="item__date">${
          obj.datePrel
        }</div><div class="item__description">${
          obj.description
        }</div><div class="right clearfix"><div class="item__value">${formatNumber(
          obj.value,
          type
        )}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Dejo solo este a la hora de reemplazar el html por informacion dinamica, porque al usar template strings sin esta linea de codigo, por alguna razon no funciona
      newHtml = html.replace("%id%", obj.id);

      // 3) Aca es donde inserto finalmente el elemento al html. Seleccionando el elemento cuya class tiene su valor en la variable element y le inyecto la variable que contiene todo el codigo html del item
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

      // 4) Aca es donde selecciono el input de las categorias, y verifico que si su valor es IMPORTANTE entonces al agregar el item, le cambio el color al input a ROJO, y si no es asi, verifico los diferentes posibles valores para colocarle diferentes colores.
      let badge = document.querySelector(DOMstrings.inputCategorie);

      // LO ACTUALIZO CUANDO DECIDA LOS COLORES PARA CADA CATEGORIA
      /*
      if (badge.value === "Important") {
        badge.style.backgroundColor = "#FF5049";
      } else if (badge.value === "Loisirs") {
        badge.style.backgroundColor = "#1EA9FA";
      } else if (badge.value === "Food") {
        badge.style.backgroundColor = "#36BA97";
      } else if (badge.value === "Others") {
        badge.style.backgroundColor = "#FACA2B";
      } else {
        badge.style.backgroundColor = "red";
      }
      */
    },

    // 3) Aca es donde elimino el item del DOM, simplemente recibo el ID del elemento, procedo a seleccionar el elemento por su id, y lo almaceno en la variable de EL. Y procedo a seleccionar ese elemento almacenado en EL, y selecciono su padre que es el contenedor, y le aplico al contenedor el metodo de removeChild para eliminar el hijo que va a ser este item y le paso la variable que contiene el elemento a eliminar.
    deleteListItem: (selectorID) => {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
      // el.remove(); La otra forma mas facil es esta
    },

    // 4) Aca es donde vacio los inputs una vez agrego un item, primero creo dos variables vacias.
    clearFields: () => {
      let fields, fieldsArr;

      // 1) Procedo a almacenar en la primera variable el resultado de usar querySelectorAll para seleccionar el input de descripcion, el input del numero y el input de la fecha y les coloco una coma entre cada uno, esto me da como resultado un array con cada elemento html de los inputs teniendo una coma entre cada uno. Algo a tener en cuenta es que este array es un NodeList, es decir un array de elementos html, no es un array real. Ya que cree el array usando querySelectorAll que es para crear arrays de elementos html.
      fields = document.querySelectorAll(
        DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue +
          ", " +
          DOMstrings.inputDate
      );

      // 2) Aca es donde procedo a crear un array real usando del constructor de Array que es para utilizar metodos que se usan solo sobre arrays, selecciono de su prototipo, y en este caso uso el metodo de SLICE, que este metodo lo que hace es seleccionar que elementos quiero extraer de un array, pero en este caso lo que tengo en FIELDS no es un array real por lo tanto no puedo usar SLICE sobre este. Asi que lo que uso es el metodo CALL para establecer forzosamente el elemento sobre el que va a aplicarse el metodo SLICE, en este caso el array de nodeList que tengo en la variable FIELDS. De esa forma aunque fields no sea un array real, con CALL le hago creer a SLICE que esta trabajando sobre un array real. Y al no haber especificado un comienzo y final en el metodo de SLICE, este crea un array nuevo con absolumanente todo lo que hay en fields.
      fieldsArr = Array.prototype.slice.call(fields);

      // 3) Una vez teniendo un array real, ahora puedo usar forEach para loopear sobre cada uno, y a cada uno darle un valor vacio.
      fieldsArr.forEach((current, index, array) => {
        current.value = "";
      });

      // 4) Y aca finalmente selecciono el segundo elemento html que hay en el array de fieldsArr, este input seria el de la descripcion del item. Y uso FOCUS para seleccionarlo.
      fieldsArr[1].focus();
    },

    // 6) Este metodo es el que actualiza en el DOM los ingresos totales, gastos totales y el dinero disponible. Lo primero es que recibo el objeto que contiene los fields del dinero total disponible, los gastos totales y los ingresos totales.
    displayBudget: (obj) => {
      // 1)
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: (percentages) => {
      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: () => {
      let now, date, months, month, year;

      now = new Date();

      months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      month = now.getMonth();
      date = now.getDate();
      year = now.getFullYear();
      document.querySelector(
        DOMstrings.dateLabel
      ).textContent = `el ${date} de ${months[month]} del ${year}`;
    },

    changeType: () => {
      let fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue +
          "," +
          DOMstrings.inputDate
      );

      nodeListForEach(fields, (cur) => {
        cur.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },

    getDOMstrings: () => {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
// Esta funcion que es llamada al iniciarse la app, es llamada recibiendo como argumentos primero la variable de budgetController que si recuerdo bien arriba de todo esta variable es una IIFE que dentro almaceno el retorno de la funcion IIFE que es el objeto que tiene las diferentes funciones para eliminar items, agregar items, calcular porcentajes, etc. Y la segunda variable es la que manipula el DOM ya que dentro tiene las selecciones de los elementos HTML y aplica los cambios cuando coloco ingresos, gastos, etc. Pero lo mas importante es el retorno que da esta IIFE y que se almacena en la variable de controller, en este da como retorno un objeto que dentro tiene un field llamado INIT que esto lo explico en detalle abajo de todo donde finaliza esta IIFE. Y es la funcion que llamo al inicializarse la app y que se encarga de desplegar los numeros iniciales de 0 en los ingresos/gastos totales y el dinero disponible total y de llamar a setupEventListeners para establecer las escuchas a cuando haga click a los botones de agregar items, eliminar, etc.
let controller = ((budgetCtrl, UICtrl) => {
  // 0) En esta IIFE de controller lo primero que tengo es esta variable llamada setupEventListeners que contiene una funcion anonima que dentro crea una variable llamada DOM que dentro almacena el valor de llamar al metodo de getDOMstrings que tengo dento de UIController y que da como retorno la variable de DOMstrings que es un objeto que tiene diferentes fields por cada elemento html y como valor la class de esos elementos. Despues procedo a usar querySelector para seleccionar de esta variable, el field cuyo nombre es inputBtn que si recuerdo bien tiene como valor la class del elemento, y esto me viene como anillo al dedo para aplicarle el eventListener. Para que cuando haga click se ejecute el metodo de ctrlAddItem que agrega el item al DOM una vez le hago click boton de agregar. Despues escucho en el documento el evento de keypress para detectar teclas, y si la tecla es 13 es decir es ENTER, entonces llamo nuevamente al metodo que agrega el item al DOM. Despues se repite el mismo proceso de citar la variable y seleccionar en los dos ultimos casos, el input de eliminar que llama al metodo que elimina el item del DOM, y el otro que escucha al input del TYPE para que cuando cambie por ejemplo el INPUT de INGRESO/GASTO, cambie el color de los inputs cuando les hago click, de verde a rojo si es gasto, o rojo a verde si es ingreso.
  const setupEventListeners = () => {
    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeType);
  };

  // 1)
  const loadData = function () {
    let storedData = budgetCtrl.getStoredData();

    if (storedData) {
      budgetCtrl.updateData(storedData);

      // 3. create income items
      storedData.allItems.inc.forEach(function (cur) {
        let newIncItem = budgetCtrl.addItem(
          "inc",
          cur.description,
          cur.value,
          cur.datePrel,
          cur.categorie
        );
        UICtrl.addListItem(newIncItem, "inc");
      });

      // 4. Creating  expense items
      storedData.allItems.exp.forEach(function (cur) {
        let newExpItem = budgetCtrl.addItem(
          "exp",
          cur.description,
          cur.value,
          cur.datePrel,
          cur.categorie
        );
        UICtrl.addListItem(newExpItem, "exp");
      });

      // 5. Display the budget
      budget = budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);

      // Display the percentage
      updatePercentages();
    }
  };

  // 2) Esta variable contiene dentro una funcion anonima que primero llamada al metodo calculateBudget que tengo dentro de budgetController, la variable que recibio esta funcion que tiene dentro un objeto con varios fields con metodos, entre ellos el de calculateBudget para calcular el dinero total disponible. Tras llamar a ese metodo, dentro de budgetController hay un variable llamada DATA que es un objeto que dentro tiene detalles de los gastos totales, ingresos totales, etc. Entonces estos valores fueron actualizados tras llamar a calculateBudget, de esa forma procedo a llamar al segundo metodo de getBudget que este da como retorno un objeto con varios fields que extraen de DATA justamente el gasto total, el ingreso total, el porcentaje de gasto y el dinero total disponible. Este objeto lo almaceno en la variable de budget y procedo a llamar al metodo de displayBudget que tengo en UIcontroller y le paso este objeto, este metodo claramente se encarga de actualizar el DOM colocando estos valores actualizados cada vez que ingreso un gasto o un ingreso.
  const updateBudget = () => {
    budgetCtrl.calculateBudget();

    let budget = budgetCtrl.getBudget();

    UICtrl.displayBudget(budget);
  };

  // 3) Esta variable contiene una funcion anonima que calcula los porcentajes de cada gasto agregado y el porcentaje del gasto total frente al ingreso total. Esto primero comienza llamando al metodo de calculatePercentages que se encuentra dentro budgetController y es donde se calcula el porcentaje de gasto que representa cada gasto frente al ingreso total y se almacena en THIS.PERCENTAGE en cada item de gasto. Despues llamo al metodo de getPercentages que lo que hace es loopear sobre cada item de gasto que tengo y por cada uno llama al metodo de getPercentage que heredo cada item de su class de EXPENSE y esto da como retorno el porcentaje que representa ese gasto frente al gasto total que es justamente lo que le almacene a estos items al llamar a calculatePercentages, ya que ese porcentaje fue almaceno en THIS.PERCENTAGE, y entonces al tener un map, esto crea un nuevo array con estos porcentajes y lo da como retorno y procedo a almacenarlo en percentages. Y finalmente llamo al metodo de displayPercentages que se encuentra en UIcontroller y que le paso este array de porcentajes para que los coloque sobre cada item de gasto que tenga.
  const updatePercentages = () => {
    // 1. calculate the percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percetanges from the budget controller
    let percentages = budgetCtrl.getPercentages();

    // 3. update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // 4) Este metodo tiene una funcion anonima que primero crea dos variables vacias. La primera variable pasa a tener como valor el resultado de llamar al metodo de getInput que se encuentra en el UIcontroller que recibo esta funcion. Y este metodo se encarga de dar como retorno un objeo con todos los valores ingresados en el input que almaceno en la variable de INPUT. Y procedo a a verificar que la descripcion no es igual a una string vacia, y que el valor ingresado no este vacio (NaN) y que sea mayor a 0. En ese caso procedo a llamar al metodo de addItem que tengo en el budgetController y le paso los valores ingresados en el input. Esto agrega el item de gasto/ingreso dentro de DATA.ALLITEMS y dentro del field que contenga el array que sea de gasto/ingreso, finalmente esto me da como retorno un objeto creado con class de EXPENSE/INCOME en base al type que haya seleccionado en el input. Y lo almaceno en la variable de newItem. Despues finalmente procedo a llamar a UIcontroller y llamo al metodo que agrega al item al UI, pasandole el objeto del nuevo item y el tipo del input ya que en base a eso crea un elemento dentro del div de los gastos o el de los ingresos. Despues procedo a llamar al metodo que limpia los inputs en la UI. Y finalmente llamo al metodo de updateBudget que actualiza el gasto total (en caso de ingresar un gasto), el ingreso total, el porcentaje de gasto frente al ingreso total(en caso de haber gastos) y el dinero total disponible(ya se positivo o negativo si tengo mas en gastos que ingresos).
  const ctrlAddItem = () => {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the dudget controller
      newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value,
        input.datePrel,
        input.categorie
      );

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate an update budget
      updateBudget();

      // 6. Calculate and update the percentages
      updatePercentages();

      // 7. Almaceno el item en localStorage
      budgetCtrl.storeData();
    }
  };

  // 5) Esta variable contiene una funcion anonima que claramente se encarga de eliminar un item de ingreso/gasto. Lo primero que recibe es el evento al haberle hecho click al icono de eliminar y procedo a crear 4 variables vacias. La primera variable creada va a tener como valor el seleccionar el elemento padre, es decir el div que encierra todos los detalles sobre el ingreso/gasto, y de este voy a seleccionar el id que tiene este elemento (INC-0, INC-1, o puede ser EXP-1, EXP2 en caso de gasto), y procedo a chequear que si recibi ese id, entonces uso split para dividir este id en donde tengo el guion, esto me da un array de 2 elementos que almaceno en la variable de SPLITID, despues voy a almacenar el type, seleccionando del array de splitID, el primer elemento, esto me va a dar INC o EXP, y finalmente selecciono el segundo elemento del array que contiene el numero y lo almaceno en la variable de ID. Y finalmente procedo a elliminar del budgetController el item dentro de DATA.ALLITEMS y en el field que sea el array del tipo de item(ingreso/gasto) pasandole justamente el tipo y el ID. Y despues procedo a llamar al metodo de deleteListItem de UIcontroller para actualizar el DOM pasandole la variable que contiene el ID entero (inc-0 o exp-0), y finalmente con todo esto actualizado procedo a llamar al metodo que actualiza en budgetController el dinero disponible, el total gastado, total ingresado, etc y que a su vez llama a UIcontroller para mostrar esos numeros actualizados. Y finalmente llamo a updatePercentages que actualiza los porcentajes en budgetController y tambien en UIcontroller para mostrarlo en cada gasto y el gasto total.
  const ctrlDeleteItem = (event) => {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. update and show the new budget
      updateBudget();

      // 4. Calculate and update the percentages
      updatePercentages();

      // 5. save to localstorage
      budgetCtrl.storeData();
    }
  };

  return {
    init: function () {
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
      loadData();
    },
  };
})(budgetController, UIController); // Importante entender que al llamar a la IIFE usando () al final, a la funcion cuando la llamo le puedo pasar argumentos que los recibe arriba de todo, en este caso le paso por un lado la variable de budgetController que si recuerdo bien arriba de todo esta da como retorno el objeto que tiene las diferentes funciones para eliminar items, agregar items, calcular porcentajes, etc. Y la segunda variable es la que manipula el DOM ya que dentro tiene las selecciones de los elementos HTML y aplica los cambios cuando coloco ingresos, gastos, etc.

// La IIFE function de controller almacena en la variable solo lo que de como retorno, en este caso estoy almacenando en la variable de CONTROLLER un objeto que tiene dentro un field llamado INIT que dentro equivale a una funcion que llama al metodo de displayMonth que esta dentro de UICtrl que es justamente la variable que recibio esa IIFE cuando la llame pasandole UIController, y esta variable si chequeo UIController voy a ver que es otra IIFE que da como retorno varios metodos, entre ellos displayMonth para mostrar el dia, mes y ano actual. Y tambien el metodo de displayBudget que le envio un objeto con el valor default de la app, que en este es 0 para el dinero disponible, los gastos totales, ingresos totales y el porcentaje de gasto. Y por ultimo llama al metodo de setupEventListeners que lo puede llamar porque justamente esta dentro del IIFE y se encarga de agregar los eventListeners para cuando haga click a algun input por ejemplo cuando agrego un gasto/ingreso.
controller.init();

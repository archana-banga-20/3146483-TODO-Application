const  RESPONSE_DONE = 4;
const STATUS_OK = 200;
var ACTIVE_TODOS_ID = 'activeTodos';
var COMPLETE_TODOS_ID = 'completeTodos';
var DELETED_TODOS_ID = 'deletedTodos'

window.onload = getTodosAJAX();

/**
 *
 * @param source_id
 * Change Visibility(Hide/Show) of Todos
 */
function changeVisibility(source_id) {

    var hidden_div_id =''; var src_label = '';
    //If Source is from Complte Todo then set source id of Complete Todo Item
    if (source_id == 'hide_complete'){
        hidden_div_id = COMPLETE_TODOS_ID;
        src_label = 'hide_complete';
    }
    //If Source is from delte Todo then set source id of Delete Todo Item
    if(source_id == 'hide_delete'){
        hidden_div_id = DELETED_TODOS_ID;
        src_label = 'hide_delete';
    }

    var visibility = document.getElementById(hidden_div_id).style.display;

    if(visibility!='none'){
        document.getElementById(hidden_div_id).style.display = 'none';
        document.getElementById(src_label).innerHTML = 'Show Todos';
    }
    else {
        document.getElementById(hidden_div_id).style.display = 'block';
        document.getElementById(src_label).innerHTML = 'Hide Todos';
    }
}

/**
 *
 * @param id
 * Mark Todo Active
 */
function activeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var body_data ="todo_status=ACTIVE";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {    //means response is ready
            if (xhr.status == STATUS_OK) {
                //refresh the todo elements
                add_todo_elements(xhr.responseText);
            }else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(body_data);
}


/**
 *
 * @param id
 * Mark Todo Complete
 */
function completeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var body_data ="todo_status=COMPLETE";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {    //means response is ready
            if (xhr.status == STATUS_OK) {
                //refresh the todo elements
                add_todo_elements(xhr.responseText);
            }else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(body_data);
}


/**
 *
 * @param id
 * Mark Todo Delete
 */
function deleteTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id,true);

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var body_data ="todo_status=DELETED";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {    //means response is ready
            if (xhr.status == STATUS_OK) {
                //refresh the todo elements
                add_todo_elements(xhr.responseText);
            }else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(body_data);
}


/**
 *
 * @param id
 * @param todo_oject
 * Create Todo Div and return Div
 * @returns {Element}
 */
function createTodoElement(id,todo_oject) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-divid",id);
    todo_element.style.padding = '1%';

    //If Todo Object is Active
    if(todo_oject.status == 'ACTIVE'){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = todo_oject.title;
        checkbox.value = todo_oject.title;
        checkbox.id = id;
        checkbox.setAttribute("data-id",id);
        checkbox.setAttribute("onchange","completeTodoAJAX("+id+")");
        checkbox.setAttribute('class','checkbox');
        todo_element.appendChild(checkbox);

        var lbl_title = document.createElement("label");
        lbl_title.innerText = todo_oject.title;
        lbl_title.setAttribute("class",'active_status');

        todo_element.appendChild(lbl_title);

        var lbl = document.createElement("label");
        lbl.innerText = "x";
        lbl.setAttribute("onclick" , "deleteTodoAJAX("+id+")");
        lbl.setAttribute("class",'delete_label');
        todo_element.appendChild(lbl);
    }
    //If Todo Object is Complete
    if(todo_oject.status == 'COMPLETE'){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = true;
        checkbox.setAttribute("data-id",id);
        checkbox.setAttribute("onchange","activeTodoAJAX("+id+")");
        checkbox.setAttribute('class','checkbox');
        todo_element.appendChild(checkbox);

        var lbl_title = document.createElement("label");
        lbl_title.innerText = todo_oject.title;
        lbl_title.setAttribute("class",'complete_status');
        todo_element.appendChild(lbl_title);


        var lbl = document.createElement("label");
        lbl.innerText = "x";
        lbl.setAttribute("class",'delete_label');
        lbl.setAttribute("onclick" , "deleteTodoAJAX("+id+")");

        todo_element.appendChild(lbl);
    }

    //If Todo Object is Deleted
    if(todo_oject.status == 'DELETED'){
        var lbl = document.createElement("label");
        lbl.innerText = todo_oject.title;
        lbl.setAttribute("class",'delete_status');

        todo_element.appendChild(lbl);
    }

    return todo_element;
}

/**
 *
 * @param todos_data_json
 * add different todos to respective parent
 */
function add_todo_elements(todos_data_json) {
    var todos = JSON.parse(todos_data_json);
    var parent_active = document.getElementById(ACTIVE_TODOS_ID);
    var parent_complete = document.getElementById(COMPLETE_TODOS_ID);
    var parent_delete = document.getElementById(DELETED_TODOS_ID);
    parent_active.innerHTML = "";
    parent_complete.innerHTML = "";
    parent_delete.innerHTML = "";
    if(parent){
      Object.keys(todos).forEach(
          function (key) {
              var todo_element = createTodoElement(key,todos[key]);
              if(todos[key].status == 'ACTIVE') {
                  parent_active.appendChild(todo_element);
              }
              else if(todos[key].status == 'COMPLETE'){
                  parent_complete.appendChild(todo_element);
              }
              else if(todos[key].status == 'DELETED'){
                  parent_delete.appendChild(todo_element);
              }


          }
      )
    }
}


/**
 * get ALL Todos
 */
function getTodosAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/api/todos",true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {    //means response is ready
            //is resonse ok
            //status code === 200
            if (xhr.status == STATUS_OK) {
                add_todo_elements(xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}


/**
 * add new todo
 */
function addTodoAjax() {
    var title = document.getElementById('new_todo_input').value;
    document.getElementById('new_todo_input').value = "";

    var xhr = new XMLHttpRequest();
    xhr.open("POST","/api/todos",true);

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var body_data ="todo_title="+ encodeURI(title);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE) {    //means response is ready
            if (xhr.status == STATUS_OK) {
                //refresh the todo elements
                add_todo_elements(xhr.responseText);
            }else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(body_data);
}





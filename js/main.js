


/**
 *   fetch("..." , {
 * 
 * method :  '
 * body :  ,
 * headers :  ,
 * 
 * })
 * headers =>
 * 
 * can be :   'content-type'   : 'application\json' | text\plain | 
 * 
================================================
 *                  application/x-www-form-urlencoded - Form data
                    multipart/form-data - File uploads
                    text/plain - Plain text
                    text/html - HTML content
================================================



 *        :   "Authorization"  : 'barear token123..' | password key | 
 *        :   "Accept"         : applicatio/json | ...
 *        :   "custom headers" : ...
 *        :   "cach-control" : "no-cache"
*/

const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "6949582f600ccb137ffe54be";
let allTODOs;
getAllTODOs();//contains displayAllTODOs()  else


// =========================================================================
formElement.addEventListener('submit', (e) => { //submit = enter | press button[type="submit"]
    e.preventDefault();
    // console.log("hi");
    // console.log(inputElement.value);
    addTODO();
})
// =========================================================================
async function addTODO() {



    const obj = {
        title: inputElement.value,
        // generate new one by : https://todos.routemisr.com/api/v1/getApiKey
        apiKey: apiKey
    }

    const response = await fetch("https://todos.routemisr.com/api/v1/todos",
        {
            method: "post",
            //body must be sent string ^^
            body: JSON.stringify(obj),
            headers: {
                'content-type': "application/json"

            }

        }
    );
    if (response.ok) {
        const data = await response.json();

        if (data.message === "success") {

            //getAllTODOs : [displayAllTODOs]
            await getAllTODOs(); //it's asyn   => so i need await to avoid to make the reset of the form done before it finish
            // console.log(data);//{message : "success"}
            formElement.reset();//will not reset untill [allTODOs return]
        }

    }

}


// ====================================
async function getAllTODOs() {

    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`,
        {
            // method:'get'  // it's by default ^^
        }
    );

    if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
            // console.log(data);
            allTODOs = data.todos;//[{} , {} , {} ,....]
            console.log(allTODOs);
            displayAllTODOs();

        }
    }



}
// getAllTODOs();
// ====================================
function displayAllTODOs() {
    let cartona = ``;


    for (const todoElement of allTODOs) {
        cartona += `

        <li class="d-flex justify-content-between align-items-center border-bottom pb-2 my-2">
                <span onclick="markCompleted('${todoElement._id}');" class="task-name ${todoElement.completed ? `completed` : ``}" style="${todoElement.completed ? `text-decoration: line-through;` : ``}">${todoElement.title}</span>
                <div class="d-flex align-items-center gap-4 ">
                    <span><i class="fa-solid fa-circle-check ${todoElement.completed ? `d-block` : `d-none`}" style="color: #63E6BE;"></i></span>
                    <span onclick="deleteTODO('${todoElement._id}')" class="trash-icon-wrapper rounded"><i class="fa-solid fa-trash text-white "></i></span>
                </div>
            </li>
        
        `;


    }
    document.getElementById("rowData").innerHTML = cartona;

}
// ====================================

async function markCompleted(todoID) {

    const todoData = {
        todoId: todoID
    }
    const obj = {
        method: "put", // put : for update
        body: JSON.stringify(todoData),
        headers: {
            "content-type": "application/json"
        }
    }



    const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
    // console.log(response);
    if (response.ok) {
        const data = await response.json();
        // console.log(data);
        if (data.message === "success") {// in backend ->the todo become {... , completed = true , ...}
            //will not call displayAllTODOs() ...because it use allTODOs array which is empty after loading ^^
            //so will use getAllTODOs.. contain displayAllTODOs and update the array with the data from the API ^^
            getAllTODOs();


        }
    }


}
// ====================================

async function deleteTODO(id) {



    const todoData = {
        todoId: id
    };
    const obj = {
        method: "delete",
        body: JSON.stringify(todoData),
        headers: {
            "content-type": "application/json"
        }
    };

    const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
    if(response.ok){
        const data = await response.json();
        if(data.message === "success"){
            getAllTODOs();
        }
    }


}
// ====================================


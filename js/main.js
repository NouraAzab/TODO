


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
    if (inputElement.value.trim().length > 0) {
        addTODO();
    }
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
            toastr.success('Added Successfuly :)', "Add a new TODO")
            await getAllTODOs(); //it's asyn   => so i need await to avoid to make the reset of the form done before it finish
            // console.log(data);//{message : "success"}
            formElement.reset();//will not reset untill [allTODOs return]
        }
        else {// still it's not an error from the server , but backender called me ^^
            // console.log(data);//{message:'error' , error:[message:...]}
            // console.log(data.error[0].message);//the msg from backend[server] =>  title is not allowed to be empty"
            toastr.error(`${data.error[0].message}`, 'Error happend!')
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
                <span ${todoElement.completed ? `` :`onclick="markCompleted('${todoElement._id}');"` } class="task-name ${todoElement.completed ? `completed` : ``}" style="${todoElement.completed ? `text-decoration: line-through;` : ``}">${todoElement.title}</span>
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

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(90, 83, 189)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, make it complete!"
    }).then(async (result) => {
        if (result.isConfirmed) {

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
                    Swal.fire({
                        title: "Completed :)",
                        icon: "success"
                    });


                }
            }

        }
    });


}
// ====================================

async function deleteTODO(id) {


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //   confirmButtonColor: "#3085d6",
        confirmButtonColor: "rgb(90, 83, 189)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {

            //begin the logic of delete after conforming first :)
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
            if (response.ok) {
                const data = await response.json();
                if (data.message === "success") {
                    Swal.fire({ // event will fire 
                        title: "Deleted!",
                        icon: "success"
                    });
                    getAllTODOs();
                }
            }



        }
    });










}
// ====================================



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

// =========================================================================
formElement.addEventListener('submit', (e) => {
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

            await getAllTODOs(); //it's asyn   => so i need await to avoid to make the reset of the form done before it finish
            // console.log(data);//{message : "success"}
            formElement.reset();//will not reset untill [allTODOs return]
        }

    }

}


// ====================================
async function getAllTODOs(){

    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}` , 
        {
            // method:'get'  // it's by default ^^
        }
    );

    if(response.ok){
        const  data = await response.json();
        if(data.message === "success"){
            // console.log(data);

            allTODOs = data.todos;//[{} , {} , {} ,....]
            console.log(allTODOs);
            displayAllTODOs();

        }
    }



}
// getAllTODOs();


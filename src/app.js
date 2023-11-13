
//get SignUp form 

const form = document.getElementById('form');
const loginForm = document.getElementById("loginform");
let data = [];
function setData(name,data)
{
    localStorage.setItem(name, JSON.stringify(data));
}
function getData(name)
{
    const data = localStorage.getItem(name);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function getDataSessionStorage(sessionKey){
    const sessionData = sessionStorage.getItem(sessionKey);
    if (sessionData){
        return JSON.parse(sessionData);
    }
    return [];
}

if (form) {


    function saveData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
        alert("Sign Up Sucessfull");
    }

    function loadData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData);
        }
        return [];
    }

    function isEmailExists(email) {
        return data.some(entry => entry.email === email);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        console.log(form);
        // Convert form data into an object
        const formData = new FormData(form);

        const obj = Object.fromEntries(formData);
        // console.log(obj.available_balance);

        const { email } = obj;

        // Check if the email already exists
        if (isEmailExists(email)) {
            alert('Email already exists in the local storage.');
            return;
        }

        // Push the new data to the array
        data.push(obj);

        // Save the updated data to localStorage
        saveData(data);

        // Do something with the data array (e.g., display it)
        console.log(data);
    });

    // Load initial data when the page loads
    data = loadData();
    console.log(data);
}

if (loginForm) {

    function storeData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    }

    function fetchData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData);

        }
        return [];
    }

    function dataExist(email, password) {
        return data.some((e) => e.email == email && e.password == password);
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        data = fetchData();

        const loginFormData = new FormData(loginForm);
        const loginObj = Object.fromEntries(loginFormData);

        const { email, password } = loginObj;

        if (dataExist(email, password)) {
            for (let j = 0; j <= data.length; j++) {
                if (email == data[j].email) {
                    sessionStorage.setItem("userData", JSON.stringify(data[j]));
                    break;
                }
            }
            location.assign("http://127.0.0.1:5500/src/dashboard.html");
        } else {
            alert("Login Failed");
        }

    })
}

function clearData() {
    sessionStorage.clear();
}

const balance_btn = document.getElementById("show_balance");
if (balance_btn) {
    balance_btn.addEventListener("click", function () {
        let bal = JSON.parse(sessionStorage.getItem("userData"));
        let preValue = document.getElementById("balance").innerHTML;
        let updatedValue = `${preValue} ${bal.available_balance}`;
        document.getElementById("balance").innerHTML = updatedValue;

    }, { once: true });
}

const deposite = document.getElementById("deposite_form");

if (deposite) {
    function localStorageData() {
        const localUsers = localStorage.getItem('userData');
        if (localUsers) {
            return localUsers;
        }
        return [];
    }

    const sessionStorageData = JSON.parse(sessionStorage.getItem("userData"));

    data.push(localStorageData());
    data = JSON.parse(data);

    for (let t = 0; t < data.length; t++) {


        if (data[t].email == sessionStorageData.email) {
            deposite.addEventListener("submit", (e) => {
                e.preventDefault();
                depositeForm = new FormData(deposite);
                depositeObj = Object.fromEntries(depositeForm);

                let available_balance = parseInt(data[t].available_balance);
                let input = parseInt(depositeObj.available_balance);

                data[t].available_balance = available_balance + input;
                alert("Amount Deposited");
                localStorage.setItem('userData', JSON.stringify(data));
                sessionStorage.setItem('userData', JSON.stringify(data[t]))
            })
            break;
        }
    }
}

//Transaction Section 
const transactionForm = document.getElementById("transactionForm");
const transactionHistory = [];
if (transactionForm) {

    function localStorageData() {
        const localUsers = localStorage.getItem('userData');
        if (localUsers) {
            return localUsers;
        }
        return alert("Record Not Found");
    }
    data.push(localStorageData());
    data = JSON.parse(data);

    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const transactionFormData = new FormData(transactionForm);
        transactionFormObj = Object.fromEntries(transactionFormData);
        let currentUser = JSON.parse(sessionStorage.getItem('userData'));
        if(transactionFormObj.email != currentUser.email)
        {
            for(let l = 0; l <data.length ; l++){
                    if(transactionFormObj.email == data[l].email ){
                        //Transaction Amount 
                        let inputAmount = parseInt(transactionFormObj.transaction_amount);

                        //current User Available Balance
                        let available_balance = parseInt(data[l].available_balance); 
                    
                        //Balance After Transaction  of receiving User
                        data[l].available_balance = available_balance + inputAmount;                   

                        // Balance After Transaction  of Current User
                        let currentUserBalance = currentUser.available_balance - inputAmount;
                        currentUser.available_balance = currentUserBalance;
                        sessionStorage.setItem("userData",JSON.stringify(currentUser));

                        let findUserInData = data.findIndex((ob => ob.email == currentUser.email));
                        data[findUserInData].available_balance = currentUserBalance;
                        localStorage.setItem("userData",JSON.stringify(data));   
                        break;                    
                    } 
                
            }
            const transactions = getData('transactions');
            const transactionObj = {
                id : Date.now(),
                to : transactionFormObj.email,
                from : JSON.parse(sessionStorage.getItem("userData")).email,
                amount : parseInt(transactionFormObj.transaction_amount),
            }
            transactions.push(transactionObj);
            setData('transactions', transactions)
            transactionFormObj.email = '';
            transactionFormObj.transaction_amount = '';
            alert('Transaction done');
            return;
        }
        alert('Error: same account');
    })
}
let sortedTransaction = getData('transactions').filter(function(item){
    return item.from === JSON.parse(sessionStorage.getItem("userData")).email;
});
// console.log(sortedTransaction);
buildTable(sortedTransaction);
function buildTable(tableData) {
    const table = document.getElementById("myTable");

    for (let a = 0; a < tableData.length; a++) {
        const row = `<tr>
                    <td class="text-center">${tableData[a].id}</td>
                    <td class="text-center">${tableData[a].to}</td>
                    <td class="text-center">${tableData[a].from}</td>
                    <td class="text-center">${tableData[a].amount}</td>
        </tr>`
        table.innerHTML += row;
    }
    
 }

 
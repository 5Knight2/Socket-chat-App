const login_btn =document.querySelector('#submit');
const baseURL="http://localhost:3000/";
login_btn.addEventListener('click',login)

function login(e){
    const obj={password:document.querySelector('#pass').value,
    email:document.querySelector('#email').value
}
    axios.post(baseURL+'signin',obj)
    .then((response)=>{
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('name',response.data.name)
        localStorage.setItem('email',response.data.email)
        alert("Login successful")
        location.href="http://localhost:3000/chat/chat.html";
    })
    .catch(err=>{
        if(err.response.data.msg=="user not authorized")
        alert("wrong credentials")
        else  alert("something went wrong try again later")
    })
}
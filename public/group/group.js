const signupbtn= document.querySelector('#submit');
const baseURL="http://localhost:3000/";
signupbtn.addEventListener('click',signup);

function signup(e){
    e.preventDefault()
    if(signup_form.checkValidity()){

        const fname=document.querySelector('#fname')
       
        axios.post(baseURL+'group',{fname:fname.value},{headers:{Authorization:localStorage.getItem('token')}})
.then(()=>{alert("group created successfully")
location.href="http://127.0.0.1:5500/chat/chat.html"})
.catch((err)=>{
    alert("Something went wrong try again later")})
 
    }
}


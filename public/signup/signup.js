const signupbtn= document.querySelector('#submit');
const baseURL="http://localhost:3000/";
signupbtn.addEventListener('click',signup);

function signup(e){
    e.preventDefault()
    const pass2=document.querySelector('#pass2');
    const signup_form=document.querySelector('form');
if(document.querySelector('#pass1').value!=pass2.value)
pass2.setCustomValidity("Invalid field");
else pass2.setCustomValidity("");
    if(signup_form.checkValidity()){

        const fname=document.querySelector('#fname')
        const email=document.querySelector('#email')
        const phone=document.querySelector('#phone')

        axios.post(baseURL+'signup',{fname:fname.value,email:email.value,phone:phone.value,password:pass2.value})
.then(()=>{alert("user created successfully")
window.location.href("http://127.0.0.1:5500/signin/signin.html")})
.catch((err)=>{
    if (err.response.data.msg=='This phone number is already registered')
{alert("user already exists try logging in")
window.location.href="http://127.0.0.1:5500/signin/signin.html"}   else alert("Something went wrong try again later")})
 
    }else{
        signup_form.classList.add('was-validated')
        if(document.querySelector('#pass1').value!=pass2.value)
        alert('entered passwords are  not same')
    }
}


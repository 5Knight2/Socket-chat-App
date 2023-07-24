const sendbtn=document.querySelector('#send');
const div1=document.querySelector('#div1');
const baseURL="http://localhost:3000/";
sendbtn.addEventListener("click",sendmsg);
div1.addEventListener("click",opengroup);
let lastmsg=0;
let groupid=0;

const socket = io('http://localhost:3000',{auth:{token:localStorage.getItem('token')}});
 socket.on("connect", () => {
    console.log(socket.id); 
  });
  
  
socket.on("receive_message",(msg,name)=>{console.log(msg)

    addmsg(name,msg);
})
socket.on("error_response",(msg)=>{alert(msg)
})

showGroups();

async function opengroup(e){
    e.preventDefault()
    if(e.target.tagName=='H4'){
        groupid=e.target.id;
        div1.removeEventListener('click',opengroup);
        while(div1.firstElementChild)div1.removeChild(div1.firstElementChild)
        
        div1.append(document.createElement('br'))
        showfirst()
        
        showall()
        socket.emit('join_room',groupid,localStorage.getItem('email'))

       
       
    }else if(e.target.id=='addAdmin'){
        const emailid=e.target.parentElement.firstChild.textContent;
        groupid=div1.childNodes[3].id
        axios.post(baseURL+'make_Admin?grpid='+groupid,{email:emailid},{headers:{Authorization:localStorage.getItem('token')}})
        .then((result)=>{alert('user added as an Admin')})
        .catch(err=>{alert(err.response.data.msg)})

    }else if(e.target.id=='remove'){
        const emailid=e.target.parentElement.firstChild.textContent;
        groupid=div1.childNodes[3].id
        axios.put(baseURL+'remove?grpid='+groupid,{email:emailid},{headers:{Authorization:localStorage.getItem('token')}})
        .then((result)=>{alert('user removed from this group')})
        .catch(err=>{alert(err.response.data.msg)})


    }
    else if(e.target.id=='Edit'){
        const group=e.target.parentElement;
        while(div1.firstElementChild)div1.removeChild(div1.firstElementChild)
        div1.appendChild(document.createElement('br'))
        const child=group.childNodes;
        group.removeChild(child[child.length-1]);
        
        div1.appendChild(group);
        const email=document.createElement('input')
        email.type='email'
        email.id='email'
        email.classList.add('input-group-text')
        email.style.width='60%'

        div1.appendChild(email)
        const add=document.createElement("button")
        add.id='Add'
        add.classList.add('btn','btn-primary');
        add.appendChild(document.createTextNode('Add'));
        div1.appendChild(document.createElement('br'))
        div1.appendChild(add)
        display_Users(group.id);
    }else if(e.target.id=='Add'){
        const div1_child=div1.childNodes
        socket.emit('join_room',div1_child[3].id,div1_child[4].value)
        axios.post(baseURL+'addmember?grpid='+div1_child[3].id,{email:div1_child[4].value},{headers:{Authorization:localStorage.getItem('token')}})
         .then((result)=>{alert('useradded')})
         .catch(err=>{alert(err.response.data.msg)})
    }
}


async function display_Users(id){

    const users=await axios.get(baseURL+'group_Users?grpid='+id,{headers:{Authorization:localStorage.getItem('token')}})

    const ol=document.createElement('ol');
    for(let i=0;i<users.data.length;i++){
        const li=document.createElement('li');
        li.title=users.data[i].name
        li.appendChild(document.createTextNode(users.data[i].email))
     
        const remove_Btn =document.createElement('button');
        remove_Btn.id='remove'
        remove_Btn.classList.add('btn','btn-sm');remove_Btn.classList.add('btn-danger')
        remove_Btn.appendChild(document.createTextNode('remove'))
        const add_Btn =document.createElement('button');
        add_Btn.classList.add('btn','btn-sm');add_Btn.classList.add('btn-success')
        add_Btn.appendChild(document.createTextNode('^admin'))
        add_Btn.id='addAdmin'
        li.appendChild(remove_Btn);
        li.appendChild(add_Btn);
        ol.appendChild(li)
    }div1.appendChild(ol);

}

async function showGroups(){
    const groups=await axios.get(baseURL+'group',{headers:{Authorization:localStorage.getItem('token')}})
    
   
    for(let i=0;i<groups.data.length;i++){
        div1.appendChild(document.createElement('br'))
        const text=document.createTextNode(groups.data[i].name)
const h4=document.createElement("h4")
const add=document.createElement("button")
add.id='Edit'
add.classList.add('btn','btn-success');
add.appendChild(document.createTextNode('Edit'));
add.style.position='absolute'
add.style.right='28%'

h4.id=groups.data[i].id
h4.appendChild(text)
h4.appendChild(add)

div1.appendChild(h4); 
}

}

function showfirst(){
   let msg= localStorage.getItem('msg'+groupid)
   if(msg){msg=JSON.parse(msg)
   for(let i=0;i<msg.length;i++){
    addmsg(msg[i].user.name,msg[i].msg)
   }}
}

async function  sendmsg(e){
    e.preventDefault()
    let msg;
    const file=document.querySelector('#file')
    try{if(!file.value) {
        msg={data:'text',message:document.querySelector('#message').value}
        }
        else{ 
        msg={data:file.files[0].type,message:file.files[0]}}
        await socket.emit('send_message',msg,groupid,)
//const result=await axios.post(baseURL+'msg/'+'?grpid='+groupid,msg,{headers:{Authorization:localStorage.getItem('token')}})

//if(result.data.msg=="message stored in database")
//addmsg("You",msg.message);
//document.querySelector('#message').value=''
    }catch(err){console.log(err)}

}

async function showall(){

try{
      let msg=localStorage.getItem('msg'+groupid);
      if(msg){
      msg=JSON.parse(msg);
      lastmsg=msg[msg.length-1].id}
      else msg=[];
     if (!lastmsg)lastmsg=0;
   const result=await axios.get(baseURL+'msg/'+lastmsg+'?grpid='+groupid,{headers:{Authorization:localStorage.getItem('token')}})
   if(!result.data.length){return}
   if (lastmsg==result.data[result.data.length-1].id)return
   

lastmsg=result.data[result.data.length-1].id;
const div=document.querySelector('#div1')
   for(let i=0;i<result.data.length;i++){
   addmsg(result.data[i].user.name,result.data[i].msg)
    msg.push(result.data[i]);
}
localStorage.setItem('msg'+groupid,JSON.stringify(msg));
}catch(err){console.log(err)}
}

function addmsg(name,message){
    
    const div=document.querySelector('#div1')
const p=document.createElement('p')
p.classList.add('rounded-3')
p.style.border="1px";
p.style.borderStyle='solid';
if(name==localStorage.getItem('name')){
p.style.borderRightWidth="0px";
name='You'}
else p.style.borderLeftWidth="0px";
if(message.startsWith('http')){
    p.appendChild(document.createTextNode(name+': '))
    const anchor=document.createElement('a')
    anchor.href=message;
    anchor.appendChild(document.createTextNode('link'))
    p.appendChild(anchor)
}else{
    p.appendChild(document.createTextNode(name+': '+message))}
    div.appendChild(p);

}
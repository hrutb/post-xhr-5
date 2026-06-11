let base_url = `https://jsonplaceholder.typicode.com`
let post_url  =`${base_url}/posts` ;



let postArr= [] ;

const postContainer= document.getElementById('postContainer');
const postForm =document.getElementById('postForm');
const titleControl=document.getElementById('title');
const contentControl=document.getElementById('content');
const userIdControl=document.getElementById('userId');

const addPost =document.getElementById('addPost');
const updatePost =document.getElementById('updatePost');



function snackbar(msg,icon){
    swal.fire({ 
         title:msg,
         icon:icon,
         timer:3000
    })
}



function createCard(arr){ 
       let res= " "; 

       arr.forEach((ele)=>{ 
             res +=`<div class="col-md-6 mb-4" id=${ele.id}>
                        <div class="card">
                            <div class="card-header">
                                ${ele.title}
                            </div>
                            <div class="card-body">
                                ${ele.body}
                            </div>
                                
                            <div class="card-footer d-flex justify-content-between ">
                            <button onclick='onEdit(this)' class="btn btn-inline-block btn-outline-primary">Edit</button>
                            <button onclick='onRemove(this)' class="btn btn-inline-block btn-outline-danger">Delete</button>
                            </div>
                        </div>
                        </div>`
       }); 
       postContainer.innerHTML= res ;
}





function fetchPost(){ 
     
 let xhr= new XMLHttpRequest() ;
    xhr.open("GET", post_url); 
    xhr.send(null); 

    xhr.onload = function (){ 
            
        if(xhr.status>=200 && xhr.status<=299){ 
            console.log(xhr.response);
              postArr = JSON.parse(xhr.response);
                        
             createCard(postArr);
             
        }else{ 
               snackbar('Api call is failed....!!','error') ; 
        }
    }


}

fetchPost(); 


function onSubmit(eve){
     
     eve.preventDefault() ;
         
     let postObj ={ 
             title:titleControl.value , 
             body:contentControl.value ,
             userId:userIdControl.value      
     }    
     postArr.unshift(postObj);


     let xhr= new XMLHttpRequest() ;
         xhr.open('GET', post_url);
         xhr.send(null);

         xhr.onload = function(){ 
              if(xhr.status>=200 && xhr.status<=299){ 
                 let res = JSON.parse(xhr.response);
                  let div = document.createElement('div');
                      div.className ='col-md-6 mb-4';
                      div.id= res.id;
                      div.innerHTML = `<div class="card">
                                        <div class="card-header">
                                            ${postObj.title}
                                        </div>
                                        <div class="card-body">
                                            ${postObj.body}
                                        </div>
                                            
                                        <div class="card-footer d-flex justify-content-between ">
                                        <button onclick='onEdit(this)' class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button onclick='onRemove(this)' class="btn btn-inline-block btn-outline-danger">Delete</button>
                                        </div>
                                    </div>`  

                   postContainer.prepend(div);
               } else{ 
                      snackbar("Failed to submit Card...!" ,' error');
                  }
         }

}



function onRemove(ele){
        let removeId= ele.closest('.col-md-6').id;
        let removeUrl = `${base_url}/posts/${removeId}`;

     Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed){
                  let xhr= new XMLHttpRequest() ;
                    xhr.open('GET', removeUrl); 
                    xhr.send(null); 
                    
                    xhr.onload = function (){
                    if(xhr.status>=200 && xhr.status<=299){ 
                        
                            ele.closest('.col-md-6').remove();
                        
                        }else{ 
                            snackbar('Failed To Delete Post', 'error');
                        }
                    }

                xhr.onerror=function(){ 
                        snackbar('Failed to  load...', 'error');
                }  


              } 
            });


       
}


function onEdit(ele){  
       let editId= ele.closest('.col-md-6').id ;
       localStorage.setItem('EditId', editId);
  
       let EditUrl = `${base_url}/posts/${editId}`;

       
       
       let xhr = new XMLHttpRequest() ;
       
           xhr.open('GET', EditUrl);
           xhr.setRequestHeader('content-type', 'application/type'); 
           xhr.setRequestHeader('Autho', 'Get token from'); 

           xhr.send(null);

           xhr.onload = function(){ 
              if(xhr.status>=200 && xhr.status<=299){ 
                    let editObj =JSON.parse(xhr.response);
                       console.log(editObj);
                       
                    titleControl.value = editObj.title;
                    contentControl.value = editObj.body;
                    userIdControl.value = editObj.userId;
                    
                   addPost.classList.add('d-none');
                   updatePost.classList.remove('d-none');

                }else{ 
                     snackbar('Failed to edit post', 'error');
                }
           }

}




function onUpdate(){ 
    let updateId= localStorage.getItem('EditId');
    let updateUrl =`${base_url}/posts/${updateId}`;
    
    let updateObj = { 
           title:titleControl.value ,
           content:contentControl.value ,
           userId:userIdControl.value
        }

    let xhr = new XMLHttpRequest(); 
        xhr.open('PATCH', updateUrl);
        xhr.send(JSON.stringify(updateObj));
       
        xhr.onload = function (){ 
             if(xhr.status>=200 && xhr.status<=299){ 
                let col = document.getElementById(updateId);
                 let h3 = col.querySelector('.card-header h3').innerText = updateObj.title ;
                 let p= col.querySelector('.card-body p').innerText= updateObj.content;          
            
                   addPost.classList.remove('d-none');
                   updatePost.classList.add('d-none');
                } else{
                    snackbar('Failed to update data....', 'error')
                }
        }
     
}


postForm.addEventListener('submit', onSubmit) ;
updatePost.addEventListener('click', onUpdate);
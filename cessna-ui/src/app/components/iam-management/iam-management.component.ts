import { Component } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GuiCellEdit, GuiCellView, GuiColumn, GuiGridComponent } from '@generic-ui/ngx-grid';

@Component({
  selector: 'app-iam-management',
  templateUrl: './iam-management.component.html',
  styleUrl: './iam-management.component.css'
})
export class IamManagementComponent {
  users:any=[]
  source:any=[]
  oldrec:any=[]
  newrec:any=[]
  UserType=['Patient', 'Administrator','Doctor','Technician','Nurse','Pharmacist','Callcenter-Specialist']
  fname=false;
  lname=false;
  email_id=false;
  phno=false;
  pwd=false;
  cty=false;
  ste=false;
  rle=false;
  addres=false;
  pin=false;
  brach=false;
  all_false=false;
  cbox_callcenter=false;
  cbox_iam=false;
  cbox_appointment=false;
  cbox_history=false;
  editbutton='edit';
  addNewUsersForm = new FormGroup({
    phoneno: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required),
    callcenter: new FormControl(false, Validators.required),
    appointment: new FormControl(false, Validators.required),
    iam: new FormControl(false, Validators.required),
    history: new FormControl(false, Validators.required),
  });
  celledit=false;
  // cellEditing: GuiCellEdit = {

	// 	enabled: true,

	// 	// rowEdit: (value: any, item: any, index: number) => {
  //   //   console.log(value,item,index)
	// 	// 	return true;
	// 	// },

	// 	cellEdit: (value: any, item: any, index: number) => {
  //     console.log(value,item,index)
  //     console.log(GuiGridComponent)
	// 		return true;
	// 	}
	// }

  columns: Array<GuiColumn> = [{
		header: 'Number',
		field: 'number',
		width: 60
	}, {
		header: 'Name',
		field: 'username',
		view: GuiCellView.ITALIC
	}, {
		header: 'Position',
		field: 'role',
		view: GuiCellView.BOLD
	}, {
		header: 'Team',
		field: 'team'
	}];
  newUserModal=false;
  frole='Doctor'
  ngOninit() {this.getUsers(this.frole);}
  constructor(private user:UserserviceService,private auth:AuthService){
    // this.getUsers(this.frole);
    // console.log(this.users)
    // console.log(this.cellEditing);
  }
  getUsers(role:string){
    this.frole=role
    this.user.getRoleHistory(role).subscribe(u =>{
      console.log(u)
      this.users=[]
      this.source=[]
      // for(let i=0;i<u.length;i++){
      //   console.log(u[i]['isActive'])
      //   if(u[i]['isActive']=='active'){
      //     // console.log(u[i])
      //     this.users.push(u[i]);
      //   }
      // }
      this.users=u
      this.source=u
      console.log(u)
    });
  }
showDetails(item:any) {
  // alert(item.phoneno);
  if(this.editbutton=='edit'){
    this.celledit=true;
    console.log(item);
    this.oldrec.push(item);
    this.editbutton='submit';
    console.log("oldrec::",this.oldrec)
  }
  else{
    this.celledit=false;
    // console.log(item);
    console.log(item.phoneno);
    console.log(this.users);

    let old_rec = this.users.find((x: { phoneno: string; })=>x.phoneno==item.phoneno);
    // old_rec['city'] = item.city;
    console.log("old_rec",old_rec)
    // let phno=item.phoneno;
    // for(let i=0;i<this.source.length;i++){
    //   if(this.source[i].phoneno==phno){
    //     // console.log('from users',this.source[i])
    //     this.newrec.push(item);
    //   }
    // }
    this.editbutton='edit';
    
    console.log("old_rec::",old_rec)
    this.user.editUser(old_rec).subscribe(u =>{
      // if(u.$metadata.httpStatusCode==200){
        alert('success record updated successfully '+item.phoneno);
      // }
      console.log(u)
    });
  }
  
}

remove(item:any) {
  // alert('Remove item: ' + item.username);
  // 
  // let newUsersList:any=[]
  // this.users.forEach((element: { phoneno: any; })  => {
  //   if(element.phoneno != item.phoneno){
  //     newUsersList.push(element)
  //   }
  // });
  // this.users=newUsersList;
  // let isactive_var='active';
  if (item.isActive=='active'){
    console.log(item.isActive)
    item.isActive='inactive';
  }
  else{
    item.isActive='active';
  }
  this.user.getAcitveHistory(item).subscribe(data => {
    console.log(data)
    this.getUsers(this.frole);
  });
  // console.log(a)
  
}
addUserButton(){
  this.newUserModal=true;
}
closeModal(){
  this.newUserModal=false;
  this.fname=false;
  this.lname=false;
  this.email_id=false;
  this.phno=false;
  this.pwd=false;
  this.cty=false;
  this.ste=false;
  this.rle=false;
  this.addres=false;
  this.pin=false;
  this.all_false=false;
  this.addNewUsersForm.reset();
  this.addNewUsersForm.get('role')?.setValue('Doctor');
  // this.addNewUsersForm.controls['username'].touched=false
  
}
changeTypeOfTicket(event:any){
  let val=event.target.value;
}
onCreateSubmit(){
  console.log('value form:::',this.addNewUsersForm.value)
  if (this.addNewUsersForm.value.callcenter != true) {
    this.cbox_callcenter = false;
  }
  if (this.addNewUsersForm.value.appointment != true) {
    this.cbox_appointment = false;
  }
  if (this.addNewUsersForm.value.iam != true) {
    this.cbox_iam = false;
  }
  if (this.addNewUsersForm.value.history != true) {
    this.cbox_history = false;
  }
  if (this.addNewUsersForm.value.firstname != '') {
    this.fname = false;
  }
  if (this.addNewUsersForm.value.branch != '') {
    this.brach = false;
  }
  if (this.addNewUsersForm.value.password != '') {
    this.pwd = false;
  }
  if (this.addNewUsersForm.value.email != '') {
    this.email_id = false;
  }
  if (this.addNewUsersForm.value.phoneno != '') {
    this.phno = false;
  }
  if (this.addNewUsersForm.value.address != '') {
    this.addres = false;
  }
  if (this.addNewUsersForm.value.state != '') {
    this.ste = false;
  }
  if (this.addNewUsersForm.value.city != '') {
    this.cty = false;
  }
  if (this.addNewUsersForm.value.pincode != '') {
    this.pin = false;
  }
  if (this.addNewUsersForm.value.role != '') {
    this.rle = false;
  }
  if (this.addNewUsersForm.value.lastname != '') {
    this.lname = false;
  }

  if (this.addNewUsersForm.status == 'VALID') {
    // this.showSpinner = true;
    console.log(this.addNewUsersForm.value);
    this.auth.createNewUser(this.addNewUsersForm.value).subscribe(user => {
      // alert(user)
      console.log(user);
    });
    // this.generateHubsPot(this.addNewUsersForm.value);
    // // this.closeModal();
    // this.showSpinner = false;
    this.closeModal();
    alert("user added successfully");
  } else {
    if (this.addNewUsersForm.value.callcenter == false) {
      this.cbox_callcenter = true;
    }
    if (this.addNewUsersForm.value.appointment == false) {
      this.cbox_appointment = true;
    }
    if (this.addNewUsersForm.value.iam == false) {
      this.cbox_iam = true;
    }
    if (this.addNewUsersForm.value.history == false) {
      this.cbox_history = true;
    }
    if (this.addNewUsersForm.value.firstname == '') {
      this.fname = true;
    }
    if (this.addNewUsersForm.value.branch == '') {
      this.brach = true;
    }
    if (this.addNewUsersForm.value.password == '') {
      this.pwd = true;
    }
    if (this.addNewUsersForm.value.email == '') {
      this.email_id = true;
    }
    if (this.addNewUsersForm.value.phoneno == '') {
      this.phno = true;
    }
    if (this.addNewUsersForm.value.address == '') {
      this.addres = true;
    }
    if (this.addNewUsersForm.value.state == '') {
      this.ste = true;
    }
    if (this.addNewUsersForm.value.city == '') {
      this.cty = true;
    }
    if (this.addNewUsersForm.value.pincode == '') {
      this.pin = true;
    }
    if (this.addNewUsersForm.value.role == '') {
      this.rle = true;
    }
    if (this.addNewUsersForm.value.lastname == '') {
      this.lname = true;
    }
    this.all_false = true;
  }
}
datachange(event:any){
  console.log('event');
  console.log(event)
}
}

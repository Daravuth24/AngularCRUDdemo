import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Inject } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{

  academicList = ["Year 1", "Year 2", "Year 3", "Year 4"]
  studentForm !: FormGroup;

  actionBtn: string = "Save"

  constructor(private formBuilder: FormBuilder, 
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any, 
    private dialogRef : MatDialogRef<DialogComponent>,
    
    ){ }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      studentId : ['',Validators.required],
      studentName : ['',Validators.required],
      studentGrade : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      academicYear : ['',Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Update"
      this.studentForm.controls['studentId'].setValue(this.editData.studentId);
      this.studentForm.controls['studentName'].setValue(this.editData.studentName);
      this.studentForm.controls['studentGrade'].setValue(this.editData.studentGrade);
      this.studentForm.controls['dateOfBirth'].setValue(this.editData.dateOfBirth);
      this.studentForm.controls['academicYear'].setValue(this.editData.academicYear);
    }
  }

  addStudent(){
    if(!this.editData){
      if(this.studentForm.valid){
        this.api.postStudent(this.studentForm.value)
        .subscribe({
          next:(res)=>{
            alert("Student added successfully")
            this.studentForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding student")
          }
        })
      }
    }else{
      this.updateStudent()
    }
  }

  updateStudent(){
    this.api.putStudent(this.studentForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Student updated Successfully");
        this.studentForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the record");
      }
    })
  }

}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from './services/contact.service';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContact } from './models/contact.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  formContact: FormGroup;
  name: AbstractControl;
  lastName: AbstractControl;
  phone: AbstractControl;
  email: AbstractControl;
  information: AbstractControl;

  contactSub: Subscription;

  contacts: Array<IContact>;
  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.createForm();
    this.getContacts();
  }

  ngOnDestroy(): void {
    if (!!this.contactSub) { this.contactSub.unsubscribe(); }
  }

  createForm(): void {
    this.formContact = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      information: ['', Validators.required]
    });
    this.name = this.formContact.controls['name'];
    this.lastName = this.formContact.controls['lastName'];
    this.phone = this.formContact.controls['phone'];
    this.email = this.formContact.controls['email'];
    this.information = this.formContact.controls['information'];

  }

  getContacts(): void {
    this.contactSub = this.contactService.getContacts()
      .subscribe(contacts => {
        this.contacts = contacts;
        console.log(contacts);
      }, () => { }, () => {
        this.contactSub.unsubscribe();
      });
  }

  createContact(): void {
    if (this.formContact.valid) {
      const objConctact: IContact = {
        name: this.name.value,
        lastName: this.lastName.value,
        email: this.email.value,
        phone: this.phone.value,
        information: this.information.value
      };
      this.contactService.addContact(objConctact);
      this.formContact.reset();
    } else {
      return;
    }
  }
}

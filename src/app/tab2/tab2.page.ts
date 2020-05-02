import { Component, OnInit } from '@angular/core';
import { Customer } from '../tabs/customer';
import { CustomerService } from '../tabs/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  customer: Customer = new Customer();
  video: File;

  constructor(private customerService: CustomerService,
              private router: Router) { }

  ngOnInit() {
  }

  save() {
    this.customerService.createCustomer(this.customer, this.video);
    this.router.navigate(['/tabs/tab1']);
  }

  onSubmit() {
    this.save();
  }

  upload(event) {
    this.video = event.target.files[0];
  }

}

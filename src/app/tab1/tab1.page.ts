import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CustomerService } from '../tabs/customer.service';
import { Customer } from '../tabs/customer';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  customers: any;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.getCustomersList();
  }

  getCustomersList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  updateState(customer: Customer) {
    this.customerService.updateCustomer(customer.key, { active: !customer.active })
    .catch(err => console.log(err));
  }

  deleteCustomer(customer: Customer) {
    this.customerService.deleteCustomer(customer.key)
    .catch(err => console.log(err));
  }

}

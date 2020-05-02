import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Customer } from './customer';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private dbPath = '/customers';

  task: AngularFireUploadTask;

  customersRef: AngularFirestoreCollection<Customer> = null;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.customersRef = db.collection(this.dbPath);
  }

  createCustomer(customer: Customer, video: File): void {
    // The storage path
    const path = `customers/${Date.now()}_${video}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, video);

    // Progress monitoring
    this.task.percentageChanges();

    this.task
      .snapshotChanges()
      .pipe(finalize(async () => {
        const downloadURL = await ref.getDownloadURL().toPromise();
        customer.videoURL = downloadURL;
        this.customersRef.add({ ...customer });
      }))
      .subscribe();
  }

  updateCustomer(key: string, value: any): Promise<void> {
    return this.customersRef.doc(key).update(value);
  }

  deleteCustomer(key: string): Promise<void> {
    return this.customersRef.doc(key).delete();
  }

  getCustomersList(): AngularFirestoreCollection<Customer> {
    return this.customersRef;
  }

  deleteAll() {
    this.customersRef.get().subscribe(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }
}

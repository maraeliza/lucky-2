export class Address {
  id: number = 0;
  street: string = '';
  number: string = '';
  district: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(partial?: Partial<Address>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

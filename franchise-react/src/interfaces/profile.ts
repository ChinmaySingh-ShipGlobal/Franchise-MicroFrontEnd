export interface Address {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  locality: string;
  postcode: string;
  state_id: string;
  state: string;
  country: string;
  state_name: string;
}

export interface BillingDetails {
  company: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postcode: string;
  country_code: string;
  state_id: string;
  state_name: string;
  mobile: string;
  email: string;
}

export interface KYCDocs {
  document_type: string;
  document_value: string;
  csb_type: string;
  uuid: string;
}

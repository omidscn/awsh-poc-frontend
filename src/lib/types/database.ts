export type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
};

export type Customer = {
  id: string;
  customer_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  zip_code: string;
  city: string;
};

export type CustomerContract = {
  id: string;
  customer_id: string;
  service_type: string;
  bin_size: string | null;
  pickup_frequency: string;
  active: boolean;
  start_date: string;
  end_date: string | null;
};

export type CaseStatus = "open" | "in_progress" | "resolved" | "closed";
export type CasePriority = "high" | "medium" | "low";
export type CaseCategory =
  | "tonnenbereitstellung"
  | "abholung_verpasst"
  | "sperrmuell"
  | "rechnung"
  | "tonnentausch"
  | "adressaenderung"
  | "beschwerde"
  | "allgemein";

export type Case = {
  id: string;
  customer_id: string;
  assigned_agent_id: string | null;
  subject: string;
  category: CaseCategory;
  status: CaseStatus;
  priority: CasePriority;
  created_at: string;
  updated_at: string;
};

export type CaseWithRelations = Case & {
  customers: Pick<Customer, "id" | "first_name" | "last_name" | "customer_number">;
  emails: { count: number }[];
  agents: Pick<Agent, "id" | "first_name" | "last_name"> | null;
};

export type CustomerWithRelations = Customer & {
  customer_contracts: Pick<CustomerContract, "id" | "service_type" | "active">[];
  cases: { count: number }[];
};

export type Email = {
  id: string;
  case_id: string;
  direction: "inbound" | "outbound";
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  sent_at: string;
};

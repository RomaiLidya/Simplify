interface ContractsModel {
  id: number;
  contractId: string;
  clientId: number;
  clientName: string;
  contractTitle: string;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  invoiceNo: string;
  amount: number;
  entityId: number;
  entity: string;
  completed: number;
  totalJob: number;
  new?: boolean;
}

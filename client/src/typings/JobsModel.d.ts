interface JobsModel {
  id: number;
  completed: number;
  totalJob: number;
  serviceName: string;
  startDate: Date;
  endDate: Date;
  jobType: string;
  invoiceNo: string;
  amount: number;
  jobStatus: string;
  new?: boolean;
}

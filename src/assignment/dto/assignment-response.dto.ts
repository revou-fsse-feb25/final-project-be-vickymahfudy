export class AssignmentResponseDto {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  maxScore: number;
  dueDate: Date;
  publishedAt?: Date;
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Optional batch relation
  batch?: {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    vertical?: {
      id: string;
      name: string;
      type: string;
    };
  };
}
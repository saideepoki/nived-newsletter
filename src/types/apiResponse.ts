import { NewsletterDocument } from "@/model/newsletter";
export interface ApiResponse {
  success: boolean;
  message: string;
  newsletters?: Array<NewsletterDocument>;
}

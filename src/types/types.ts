export interface Toast {
  id: number;
  type: "success" | "error";
  title: string;
  content: string;
}
